import * as Ask from 'ask-sdk';
import { HandlerInput } from 'ask-sdk';
import { IntentRequest, Request } from 'ask-sdk-model';
import { DEFAULT_STATE, State } from './state';
import { handleBuildWeight } from './weights.handler';
import { handleNotifications } from './notifications.handler';

// TODO better dialog flow
// TODO store data in DB

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

        if (intentRequest.intent.name === 'AMAZON.CancelIntent') {
          handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });
          return handlerInput.responseBuilder.withShouldEndSession(true).getResponse();
        }

        const state = getState(handlerInput);

        const result = (
          handleBuildWeight(state, intentRequest, handlerInput) ||
          handleNotifications(state, intentRequest, handlerInput)
        );

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
