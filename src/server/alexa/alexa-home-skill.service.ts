import * as uuid from 'uuid';
import {Service} from '../../util';
import {Device} from '../devices';
import {
  ApplianceActions,
  Appliance,
  DiscoveryResponse,
  Namespaces,
  Response,
  ResponseName,
  ResponseNames,
  ErrorResponseName
} from './interfaces/home-skill';

@Service()
export class AlexaHomeSkillService {

  public createDiscoveryResponse(devices: Device[]): DiscoveryResponse {
    const header = {
      messageId: uuid.v4(),
      name: ResponseNames.DISCOVER_APPLIANCES,
      namespace: Namespaces.DISCOVERY,
      payloadVersion: '2'
    };

    const payload = {
      discoveredAppliances: devices.map((device: Device) => this.convertDeviceToAppliance(device))
    };

    return { header, payload };
  }

  public createSuccessResponse(name: ResponseName): Response {
    const header = {
      messageId: uuid.v4(),
      name: name,
      namespace: Namespaces.CONTROL,
      payloadVersion: '2'
    };
    const payload = {};

    return { header, payload };
  }

  public createErrorResponse(error: ErrorResponseName): Response {
    const header = {
      messageId: uuid.v4(),
      name: error,
      namespace: Namespaces.CONTROL,
      payloadVersion: '2'
    };
    const payload = {};

    return { header, payload };
  }

  private convertDeviceToAppliance(device: Device): Appliance {
    return {
      applianceId: device.id,
      manufacturerName: 'NATASHA',
      modelName: device.name,
      version: '1.0',
      friendlyName: device.name,
      friendlyDescription: 'Virtual Appliance', // TODO
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
