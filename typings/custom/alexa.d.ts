declare namespace Alexa {
  interface Application {
    applicationId: string;
  }
  interface User {
    userId: string;
    accessToken?: string;
  }

  type Request = StandardRequest;

  interface BaseRequest {
    version: string;
    context: {
      System: {
        application: Application;
        user: User;
        device: {
          supportedInterfaces: {
            AudioPlayer?: {};
          }
        }
      };
      AudioPlayer: {
        token: string;
        offsetInMilliseconds: number;
        playerActivity: 'IDLE' | 'PAUSED' | 'PLAYING' | 'BUFFER_UNDERRUN' | 'FINISHED' | 'STOPPED';
      }
    };
    request: {};
  }

  interface StandardRequest extends BaseRequest {
    // https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-standard-request-types-reference
    session: {
      'new': boolean;
      sessionId: string;
      application: Application;
      attributes: {
        [key: string]: any;
      };
      user: User;
    };
    request: {
      type: 'LaunchRequest' | 'IntentRequest' | 'SessionEndedRequest';
    };
  }

  interface LaunchRequest extends StandardRequest {
    request: {
      type: 'LaunchRequest';
      requestId: string;
      timestamp: string;
      locale: string;
    };
  }
  
  interface IntentRequest extends StandardRequest {
    request: {
      type: 'IntentRequest';
      requestId: string;
      timestamp: string;
      locale: string;
      intent: {
        name: string;
        slots: {
          [slotName: string]: {
            name: string;
            value: string;
          };
        };
      };
    };
  }
  
  interface SessionEndedRequest extends StandardRequest {
    request: {
      type: 'SessionEndedRequest';
      requestId: string;
      timestamp: string;
      reason: 'USER_INITIATED' | 'ERROR' | 'EXCEEDED_MAX_REPROMPTS';
      locale: string;
      error: {
        type: 'INVALID_RESPONSE' | 'DEVICE_COMMUNICATION_ERROR' | 'INTERNAL_ERROR';
        message: string;
      };
    };
  }

  interface AudioPlayerRequest extends BaseRequest {
    request: {
      type: 'AudioPlayer.PlaybackStarted' | 'AudioPlayer.PlaybackFinished' | 'AudioPlayer.PlaybackStopped' | 'AudioPlayer.PlaybackNearlyFinished' | 'AudioPlayer.PlaybackFailed';
      requestId: string;
      timestamp: string;
      token: string;
      offsetInMilliseconds: number;
      locale: string;
    };
  }

  interface PlaybackControllerRequest extends BaseRequest {
    // https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-playbackcontroller-interface-reference#playbackcontroller-requests
    request: {
      type: 'PlaybackController.NextCommandIssued' | 'PlaybackController.PauseCommandIssued' | 'PlaybackController.PlayCommandIssued' | 'PlaybackController.PreviousCommandIssued';
      requestId: string;
      timestamp: string;
      locale: string;
    };
  }

  interface SystemExceptionEncounteredRequest {
    request: {
      type: 'System.ExceptionEncountered';
      requestId: string;
      timestamp: string;
      locale: string;
      error: {
        type: string;
        message: string;
      };
      cause: {
        requestId: string;
      };
    }
  }

  namespace ResponseType {
    interface PlainSpeech {
      type: 'PlainText';
      text: string;
    }
    interface SSMLSpeech {
      type: 'SSML';
      ssml: string;
    }
  }

  type Speech = ResponseType.PlainSpeech | ResponseType.SSMLSpeech;

  // https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference
  interface Response {
    version: string;
    sessionAttributes?: {
      [key: string]: any;
    };
    response: {
      outputSpeech?: Speech;
      // "card": {
      //   "type": "string",
      //   "title": "string",
      //   "content": "string",
      //   "text": "string",
      //   "image": {
      //     "smallImageUrl": "string",
      //     "largeImageUrl": "string"
      //   }
      // },
      // "reprompt": {
      //   "outputSpeech": {
      //     "type": "string",
      //     "text": "string",
      //     "ssml": "string"
      //   }
      // },
      // "directives": [
      //   {
      //     "type": "string",
      //     "playBehavior": "string",
      //     "audioItem": {
      //       "stream": {
      //         "token": "string",
      //         "url": "string",
      //         "offsetInMilliseconds": 0
      //       }
      //     }
      //   }
      // ],

      shouldEndSession?: boolean;
    };
  }
}
