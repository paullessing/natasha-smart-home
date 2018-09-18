import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest } from 'ask-sdk-model';

export const weightsHandler: RequestHandler = {
  canHandle: (handlerInput: HandlerInput) =>
    handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    handlerInput.requestEnvelope.request.intent.name === 'StoreWeightIntent',
  handle: (handlerInput: HandlerInput) => {
    console.log('Handling Store Weight Intent');
    const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;

    const itemName = intentRequest.intent.slots && intentRequest.intent.slots['ItemName'] && intentRequest.intent.slots['ItemName'].value;
    const itemNameConfirmed = intentRequest.intent.slots && intentRequest.intent.slots['ItemName'] && intentRequest.intent.slots['ItemName'].confirmationStatus;
    const weightValue = intentRequest.intent.slots && intentRequest.intent.slots['Weight'] && intentRequest.intent.slots['Weight'].value;
    const weight = weightValue ? parseInt(weightValue, 10) : null;

    console.log('Parsed values', itemName, weight);

    if (!itemName || itemNameConfirmed === 'DENIED') {
      console.log('No item name');
      return handlerInput.responseBuilder
        .speak(`OK, I can remember an item weight. Which item would you like to add?`)
        .addElicitSlotDirective('ItemName')
        .getResponse();
    }

    if (itemNameConfirmed !== 'CONFIRMED') {
      console.log('Name is not confirmed');
      return handlerInput.responseBuilder
        .speak(`You want to add item "${itemName}"?`)
        .addConfirmSlotDirective('ItemName')
        .getResponse();
    }

    if (!weight) {
      console.log('No Weight');
      return handlerInput.responseBuilder
        .speak(`I'm setting up the weight for "${itemName}". How heavy is it?`)
        .addElicitSlotDirective('Weight')
        .getResponse();
    }

    if (intentRequest.intent.confirmationStatus !== 'CONFIRMED') {
      console.log('Not confirmed');
      return handlerInput.responseBuilder
        .speak(`The weight of "${itemName}" is ${weight} grams. Is that correct?`)
        .addConfirmIntentDirective()
        .getResponse();
    }

    console.log('Success');
    return handlerInput.responseBuilder
      .speak(`I will add item "${itemName}" with weight ${weight} grams.`)
      .withShouldEndSession(true)
      .getResponse();
  }
};

// export function handleBuildWeight(state: State, request: IntentRequest, handlerInput: HandlerInput): Response | null {
//   const slots = request.intent.slots;
//   if (isDefault(state) && request.intent.name === 'StoreWeightIntent') {
//     if (!slots || !slots['ItemName'] || !slots['ItemName'].value) {
//       return handlerInput.responseBuilder
//         .speak('Sorry, I couldn\'t understand that.')
//         .reprompt(`Try saying "Remember the weight of the IKEA bowl."`)
//         .getResponse();
//     }
//
//     const itemName = slots.ItemName.value;
//
//     const newState: BuildingWeightState = {
//       state: 'Weight',
//       itemName,
//       weight: null
//     };
//
//     handlerInput.attributesManager.setSessionAttributes({ state: newState });
//
//     return handlerInput.responseBuilder
//       .speak(`Storing the weight of "${itemName}". How heavy is it?`)
//       // .addElicitSlotDirective('Weight', {
//       //   name: 'SendNotificationIntent',
//       //   slots: {
//       //     'ItemName': slots.ItemName
//       //   },
//       //   confirmationStatus: 'NONE'
//       // })
//       .withShouldEndSession(false)
//       .getResponse();
//   }
//   if (isBuildingWeight(state) && state.weight === null && request.intent.name === 'StoreWeightIntent') {
//     if (!slots || !slots['Weight'] || !slots['Weight'].value) {
//       return handlerInput.responseBuilder
//         .speak('Sorry, I couldn\'t understand that. How heavy is it?')
//         .reprompt(`Try saying "500 grams."`)
//         .withShouldEndSession(false)
//         .getResponse();
//     }
//
//     const weight = parseInt(slots.Weight.value, 10);
//
//     const newState: BuildingWeightState = {
//       ...state,
//       weight
//     };
//
//     handlerInput.attributesManager.setSessionAttributes({ state: newState });
//
//     return handlerInput.responseBuilder
//       .speak(`Do you want to store "${state.itemName}" as ${weight} grams?`)
//       .withShouldEndSession(false)
//       .getResponse();
//   }
//   if (isBuildingWeight(state) && state.itemName !== null && state.weight !== null) {
//     // We have both name and weight, so this must be a confirmation intent
//     switch (request.intent.name) {
//       case 'AMAZON.YesIntent': {
//         handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });
//
//         return handlerInput.responseBuilder
//           .speak(`Stored "${state.itemName}" as ${state.weight} grams.`)
//           .withShouldEndSession(true)
//           .getResponse();
//       }
//       case 'AMAZON.NoIntent': {
//         handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });
//
//         return handlerInput.responseBuilder
//           .speak(`Okay, I did not store that.`)
//           .withShouldEndSession(true)
//           .getResponse();
//       }
//       default:
//         return handlerInput.responseBuilder
//           .speak(`I did not understand that. Did you want to store "${state.itemName}" as ${state.weight} grams?`)
//           .reprompt('Say "yes" or "no".')
//           .withShouldEndSession(false)
//           .getResponse();
//     }
//   }
//   return null;
// }
