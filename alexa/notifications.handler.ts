import { DEFAULT_STATE, isDefault, isNotification, NotificationState, State } from './state';
import { HandlerInput } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';

export function handleNotifications(state: State, request: IntentRequest, handlerInput: HandlerInput): Response | null {
  const slots = request.intent.slots;
  if (isDefault(state) && request.intent.name === 'SendNotificationIntent') {
    if (!slots || !slots['Notification'] || !slots['Notification'].value) {
      return handlerInput.responseBuilder
        .speak('Sorry, I couldn\'t understand that.')
        .reprompt(`Try saying "Send notification hello world".`)
        .getResponse();
    }

    const notification = slots.Notification.value;

    const newState: NotificationState = {
      state: 'Notification',
      notification
    };

    handlerInput.attributesManager.setSessionAttributes({ state: newState });

    return handlerInput.responseBuilder
      .speak(`Do you want to send the following notification? ${notification}`)
      .withShouldEndSession(false)
      .getResponse();
  }
  if (isNotification(state)) {
    switch (request.intent.name) {
      case 'AMAZON.YesIntent': {
        handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });

        // TODO send

        return handlerInput.responseBuilder
          .speak(`Sent.`)
          .withShouldEndSession(true)
          .getResponse();
      }
      case 'AMAZON.NoIntent': {
        handlerInput.attributesManager.setSessionAttributes({ state: DEFAULT_STATE });

        return handlerInput.responseBuilder
          .speak(`Okay, I did not send that.`)
          .withShouldEndSession(true)
          .getResponse();
      }
      default:
        return handlerInput.responseBuilder
          .speak(`I did not understand that. Did you want to send notification "${state.notification}"?`)
          .reprompt('Say "yes" or "no".')
          .withShouldEndSession(false)
          .getResponse();
    }
  }
  return null;
}
