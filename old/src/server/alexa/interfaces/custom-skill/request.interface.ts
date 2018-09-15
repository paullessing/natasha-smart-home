export interface Application {
  applicationId: string;
}

export interface User {
  userId: string;
  accessToken?: string;
}

export type Request = StandardRequest;

export interface BaseRequest {
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

export interface StandardRequest extends BaseRequest {
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

export interface LaunchRequest extends StandardRequest {
  request: {
    type: 'LaunchRequest';
    requestId: string;
    timestamp: string;
    locale: string;
  };
}

export interface IntentRequest<T> extends StandardRequest {
  request: {
    type: 'IntentRequest';
    requestId: string;
    timestamp: string;
    locale: string;
    intent: Intent<T>;
  };
}

export interface Intent<T> {
  name: string;
  slots: T & {
    [slotName: string]: Slot;
  };
}

export interface Slot {
  name: string;
  value: string;
}

export interface SessionEndedRequest extends StandardRequest {
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

export interface AudioPlayerRequest extends BaseRequest {
  request: {
    type: 'AudioPlayer.PlaybackStarted' | 'AudioPlayer.PlaybackFinished' | 'AudioPlayer.PlaybackStopped' | 'AudioPlayer.PlaybackNearlyFinished' | 'AudioPlayer.PlaybackFailed';
    requestId: string;
    timestamp: string;
    token: string;
    offsetInMilliseconds: number;
    locale: string;
  };
}

export interface PlaybackControllerRequest extends BaseRequest {
  // https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-playbackcontroller-interface-reference#playbackcontroller-requests
  request: {
    type: 'PlaybackController.NextCommandIssued' | 'PlaybackController.PauseCommandIssued' | 'PlaybackController.PlayCommandIssued' | 'PlaybackController.PreviousCommandIssued';
    requestId: string;
    timestamp: string;
    locale: string;
  };
}

export interface SystemExceptionEncounteredRequest {
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
