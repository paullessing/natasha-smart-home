import { BuildingWeightState, DEFAULT_STATE, isBuildingWeight, isDefault, State } from './state';
import { HandlerInput } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';

export function handleBuildWeight(state: State, request: IntentRequest, handlerInput: HandlerInput): Response | null {
  const slots = request.intent.slots;
  if (isDefault(state) && request.intent.name === 'SendNotificationIntent') {
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
