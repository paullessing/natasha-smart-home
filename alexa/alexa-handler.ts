import * as Ask from 'ask-sdk';
import { HandlerInput } from 'ask-sdk';
import { IntentRequest, Request } from 'ask-sdk-model';
import { DEFAULT_STATE } from './state';
import { weightsHandler } from './weights.handler';

// TODO better dialog flow
// TODO store data in DB

// function getState(handlerInput: HandlerInput): State {
//   const state = handlerInput.attributesManager.getSessionAttributes()['state'];
//   if (state) {
//     return state;
//   } else {
//     return {
//       state: 'None'
//     };
//   }
// }

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
      canHandle: handlerInput => {
        return isIntentRequest(handlerInput.requestEnvelope.request) &&
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
      },
      handle: (handlerInput: HandlerInput) => {
        handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });
        return handlerInput.responseBuilder.withShouldEndSession(true).getResponse();
      }
    },
    weightsHandler
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
