import * as Ask from 'ask-sdk';
import { IntentRequest } from 'ask-sdk-model';

// TODO better dialog flow
// TODO store data in DB
// TODO confirm before storing

export const handler = Ask.SkillBuilders.custom()
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
      canHandle: handlerInput =>
        handlerInput.requestEnvelope.request.type === 'IntentRequest',
      handle: handlerInput => {
        const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
        switch (intentRequest.intent.name) {
          case 'StoreWeightIntent':
            const slots = intentRequest.intent.slots;

            const existingItemName = handlerInput.attributesManager.getSessionAttributes()['itemName'];

            if (!existingItemName) {
              if (!slots || !slots['ItemName'] || !slots['ItemName'].value) {
                return handlerInput.responseBuilder
                  .speak('Sorry, I couldn\'t understand that.')
                  .reprompt(`Try saying "Remember the weight of the IKEA bowl."`)
                  .getResponse();
              }

              const itemName = slots.ItemName.value;
              handlerInput.attributesManager.setSessionAttributes({ itemName });

              return handlerInput.responseBuilder
                .speak(`Storing the weight of "${itemName}". How heavy is it?`)
                .withShouldEndSession(false)
                .getResponse();
            } else {
              if (!slots || !slots['Weight'] || !slots['Weight'].value) {
                return handlerInput.responseBuilder
                  .speak('Sorry, I couldn\'t understand that. How heavy is it?')
                  .reprompt(`Try saying "500 grams."`)
                  .withShouldEndSession(false)
                  .getResponse();
              }

              const weight = parseInt(slots.Weight.value, 10);

              handlerInput.attributesManager.setSessionAttributes({ itemName: null });

              return handlerInput.responseBuilder
                .speak(`Stored "${existingItemName}" as ${weight} grams.`)
                .withShouldEndSession(true)
                .getResponse();
            }

          // case 'AMAZON.YesIntent':
          //   if (state.Name === 'Finished') {
          //     return startNewGame(handlerInput);
          //   } else {
          //     return help(handlerInput);
          //   }
          // case 'AMAZON.NoIntent':
          //   if (state.Name === 'Finished') {
          //     return exit(handlerInput);
          //   } else {
          //     return help(handlerInput);
          //   }
          // case 'AMAZON.HelpIntent':
          //   return help(handlerInput);
          // case 'AMAZON.StopIntent':
          //   return exit(handlerInput);
          default:
            throw new Error(`Unhandled intent`);
        }
      }
    }
  )
  .addErrorHandler(
    () => true,
    (input, error) => {
      console.error(error);
      return input.responseBuilder
        .speak('Oops, something went wrong')
        .getResponse();
    }
  )
  .lambda();
