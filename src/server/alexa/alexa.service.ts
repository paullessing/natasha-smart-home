import {Service} from '../../util';

@Service()
export class AlexaService {
  public createPlainSpeechResponse(text: string): Alexa.Response {
    return this.wrapSpeech({
      type: 'PlainText',
      text
    });
  }

  public createSsmlSpeechResponse(text: string): Alexa.Response {
    return this.wrapSpeech({
      type: 'SSML',
      ssml: text
    });
  }

  private wrapSpeech(speech: Alexa.Speech): Alexa.Response {
    return {
      version: '1.0',
      response: {
        outputSpeech: speech
      }
    };
  }
}
