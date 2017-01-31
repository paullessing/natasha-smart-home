import * as uuid from 'uuid';

import {Service} from '../../util';
import {Device, DeviceUuid} from './device.interface';
import {PersistenceService, PERSISTENCE} from '../persistence/persistence.service';
import {inject} from 'inversify';

interface DeviceMap {
  [uuid: string]: Device;
}

@Service()
export class DeviceService {
  private devices: DeviceMap;

  constructor(
    @inject(PERSISTENCE) private persistenceService: PersistenceService
  ) {
    let devices = this.persistenceService.get<DeviceMap>('devices');
    if (!devices) {
      const deviceUuid = uuid.v4();
      devices = {
        [deviceUuid]: {
          name: 'Sofa Light',
          id: deviceUuid,
          isOn: false
        }
      };
      this.persistenceService.put('devices', devices);
    }
    this.devices = devices;
  }

  public getDevices(): Device[] {
    return Object.keys(this.devices).map(key => this.devices[key]);
  }

  public getDevice(deviceUuid: string): Device {
    return this.devices[deviceUuid];
  }

  public toggle(deviceUuid: DeviceUuid): Device {
    const device = this.getDevice(deviceUuid);
    if (!device) {
      throw new Error(`Not found: ${deviceUuid}`);
    }

    const newState = !device.isOn;
    device.isOn = newState;
    this.persistenceService.put('devices', this.devices);

    return device;
  }
}
