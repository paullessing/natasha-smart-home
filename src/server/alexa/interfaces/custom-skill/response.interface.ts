export namespace ResponseType {
  export interface PlainSpeech {
    type: 'PlainText';
    text: string;
  }
  export interface SSMLSpeech {
    type: 'SSML';
    ssml: string;
  }
}

export type Speech = ResponseType.PlainSpeech | ResponseType.SSMLSpeech;

export interface Directive {
  type: string;
  playBehavior: string;
  audioItem: {
    stream: {
      token: string;
      url: string;
      offsetInMilliseconds: 0
    }
  }
}

export interface Card {
  type: string;
}

export interface SimpleCard extends Card {
  title?: string;
  content?: string;
}

export interface StandardCard extends Card {
  title?: string;
  text?: string;
  image?: {
    smallImageUrl?: string;
    largeImageUrl?: string
  };
}

export interface LinkAccountCard extends Card {}

// https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference
export interface Response {
  version: string;
  sessionAttributes?: {
    [key: string]: any;
  };
  response: {
    outputSpeech?: Speech;
    card?: Card;
    reprompt?: {
      outputSpeech?: Speech;
    };
    directives?: Directive[];
    shouldEndSession?: boolean;
  };
}
