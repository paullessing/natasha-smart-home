import {inject} from 'inversify';

import {Service, CustomError} from '../../util';
import {Device, DeviceId} from './device.interface';
import {Persistence, PERSISTENCE} from '../persistence';

export class DeviceNotFoundError extends CustomError {
  constructor(public deviceId: string) {
    super(`Device ${deviceId} not found`);
  }
}

interface DeviceMap {
  [id: string]: Device;
}

@Service()
export class DeviceService {
  private devices: DeviceMap;

  constructor(
    @inject(PERSISTENCE) private persistence: Persistence
  ) {
    let devices = this.persistence.get<DeviceMap>('devices');
    if (!devices) {
      const deviceId = 'light-lr-sofa';
      devices = {
        [deviceId]: {
          name: 'Sofa Light',
          id: deviceId,
          isOn: false
        }
      };
      this.persistence.put('devices', devices);
    }
    this.devices = devices;
  }

  public getDevices(): Device[] {
    return Object.keys(this.devices).map(key => this.devices[key]);
  }

  public getDevice(deviceUuid: string): Device {
    return this.devices[deviceUuid];
  }

  public toggle(deviceId: DeviceId): Device {
    const device = this.getDevice(deviceId);
    console.log('Device ID', deviceId)
    if (!device) {
      throw new DeviceNotFoundError(deviceId);
    }

    const newState = !device.isOn;
    device.isOn = newState;
    this.persistence.put('devices', this.devices);

    return device;
  }
}
