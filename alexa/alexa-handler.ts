import * as Ask from 'ask-sdk';
import { HandlerInput } from 'ask-sdk';
import { IntentRequest, Request, Response } from 'ask-sdk-model';

// TODO better dialog flow
// TODO store data in DB

interface State {
  state: 'None' | 'Weight'
}
interface DefaultState extends State {
  state: 'None';
}
const DEFAULT_STATE = {
  state: 'None'
};
function isDefault(state: State): state is DefaultState {
  return state.state === 'None';
}

interface BuildingWeightState extends State {
  state: 'Weight';
  itemName: string | null;
  weight: number | null;
}
function isBuildingWeight(state: State): state is BuildingWeightState {
  return state.state === 'Weight';
}
function handleBuildWeight(state: State, request: IntentRequest, handlerInput: HandlerInput): Response | null {
  const slots = request.intent.slots;
  if (isDefault(state) && request.intent.name === 'StoreWeightIntent') {
    if (!slots || !slots['ItemName'] || !slots['ItemName'].value) {
      return handlerInput.responseBuilder
        .speak('Sorry, I couldn\'t understand that.')
        .reprompt(`Try saying "Remember the weight of the IKEA bowl."`)
        .getResponse();
    }

    const itemName = slots.ItemName.value;

    const newState: BuildingWeightState = {
      state: 'Weight',
      itemName,
      weight: null
    };

    handlerInput.attributesManager.setSessionAttributes({ state: newState });

    return handlerInput.responseBuilder
      .speak(`Storing the weight of "${itemName}". How heavy is it?`)
      .withShouldEndSession(false)
      .getResponse();
  }
  if (isBuildingWeight(state) && state.weight === null && request.intent.name === 'StoreWeightIntent') {
    if (!slots || !slots['Weight'] || !slots['Weight'].value) {
      return handlerInput.responseBuilder
        .speak('Sorry, I couldn\'t understand that. How heavy is it?')
        .reprompt(`Try saying "500 grams."`)
        .withShouldEndSession(false)
        .getResponse();
    }

    const weight = parseInt(slots.Weight.value, 10);

    const newState: BuildingWeightState = {
      ...state,
      weight
    };

    handlerInput.attributesManager.setSessionAttributes({ state: newState });

    return handlerInput.responseBuilder
      .speak(`Do you want to store "${state.itemName}" as ${weight} grams?`)
      .withShouldEndSession(false)
      .getResponse();
  }
  if (isBuildingWeight(state) && state.itemName !== null && state.weight !== null) {
    // We have both name and weight, so this must be a confirmation intent
    console.log('Request intent', request.intent.name);
    switch (request.intent.name) {
      case 'AMAZON.YesIntent': {
        handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });

        return handlerInput.responseBuilder
          .speak(`Stored "${state.itemName}" as ${state.weight} grams.`)
          .withShouldEndSession(true)
          .getResponse();
      }
      case 'AMAZON.NoIntent': {
        handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });

        return handlerInput.responseBuilder
          .speak(`Okay, I did not store that.`)
          .withShouldEndSession(true)
          .getResponse();
      }
      default:
        return handlerInput.responseBuilder
          .speak(`I did not understand that. Did you want to store "${state.itemName}" as ${state.weight} grams?`)
          .reprompt('Say "yes" or "no".')
          .withShouldEndSession(false)
          .getResponse();
    }
  }
  return null;
}

function getState(handlerInput: HandlerInput): State {
  const state = handlerInput.attributesManager.getSessionAttributes()['state'];
  if (state) {
    return state;
  } else {
    return {
      state: 'None'
    };
  }
}

function isIntentRequest(request: Request): request is IntentRequest {
  return request.type === 'IntentRequest';
}

export const alexaHandler = Ask.SkillBuilders.custom()
  .addRequestInterceptors(input => {
    console.log(JSON.stringify(input.requestEnvelope.request));
  })
  .addResponseInterceptors((input, output) => {
    if (output !== undefined) {
      console.log(JSON.stringify(output));
    }
  })
  .addRequestHandlers(
    // {
    //   canHandle: handlerInput => {
    //     return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    //   },
    //   handle: startNewGame
    // },
    {
      canHandle: handlerInput => {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
      },
      handle: (handlerInput: HandlerInput) => {
        return handlerInput.responseBuilder.getResponse();
      }
    },
    {
      canHandle: (handlerInput: HandlerInput) => {
        return isIntentRequest(handlerInput.requestEnvelope.request);
      },
      handle: (handlerInput: HandlerInput) => {
        const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
        const state = getState(handlerInput);

        const result = handleBuildWeight(state, intentRequest, handlerInput);

        if (!result) {
          throw new Error(`Unhandled intent`);
        } else {
          return result;
        }
      }
    }
  )
  .addErrorHandler(
    () => true,
    (input, error) => {
      console.error(error);
      return input.responseBuilder
        .speak('Something went wrong. Please check the logs.')
        .getResponse();
    }
  )
  .lambda();
