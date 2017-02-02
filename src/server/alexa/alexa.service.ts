import {Service} from '../../util';
import {Device} from '../devices/device.interface';
import {ApplianceActions, DiscoveredAppliance, DiscoveryResponse, Header, HeaderNamespaces} from './alexa-home';
import * as uuid from 'uuid';

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

  public createDiscoveryResponse(devices: Device[]): DiscoveryResponse {
    const header = {
      messageId: uuid.v4(),
      name: 'DiscoverAppliancesResponse',
      namespace: HeaderNamespaces.DISCOVERY,
      payloadVersion: '2'
    };

    const payload = {
      discoveredAppliances: devices.map((device: Device) => this.convertDevice(device))
    };

    return { header, payload };
  }

  private wrapSpeech(speech: Alexa.Speech): Alexa.Response {
    return {
      version: '1.0',
      response: {
        outputSpeech: speech
      }
    };
  }

  private convertDevice(device: Device): DiscoveredAppliance {
    return {
      applianceId: device.id,
      manufacturerName: 'NATASHA',
      modelName: device.name,
      version: '1.0',
      friendlyName: device.name,
      friendlyDescription: device.name, // TODO
      isReachable:  true,
      actions: [
        ApplianceActions.TURN_ON,
        ApplianceActions.TURN_OFF
      ],
      additionalApplianceDetails: {
        extraDetail1: 'optionalDetailForSkillAdapterToReferenceThisDevice',
        extraDetail2: 'There can be multiple entries',
        extraDetail3: 'but they should only be used for reference purposes.',
        extraDetail4: 'This is not a suitable place to maintain current device state'
      }
    };
  }
}
