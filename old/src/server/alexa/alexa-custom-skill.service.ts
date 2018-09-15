import {Service} from '../../util';
import {Response as CustomSkillResponse, Speech} from './interfaces/custom-skill';

@Service()
export class AlexaCustomSkillService {
  public createPlainSpeechResponse(text: string): CustomSkillResponse {
    return this.wrapSpeech({
      type: 'PlainText',
      text
    });
  }

  public createSsmlSpeechResponse(text: string): CustomSkillResponse {
    return this.wrapSpeech({
      type: 'SSML',
      ssml: text
    });
  }

  private wrapSpeech(speech: Speech): CustomSkillResponse {
    return {
      version: '1.0',
      response: {
        outputSpeech: speech
      }
    };
  }
}
