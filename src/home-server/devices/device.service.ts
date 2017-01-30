import * as uuid from 'uuid';

import {Service} from '../../util';
import {Device, DeviceUuid} from './device.interface';

@Service()
export class DeviceService {
  private devices: { [uuid: string]: Device };

  constructor() {
    const deviceUuid = uuid.v4();
    this.devices = {
      [deviceUuid]: {
        name: 'Sofa Light',
        id: uuid.v4(),
        isOn: false
      }
    };
  }

  public getDevices(): Device[] {
    return Object.keys(this.devices).map(key => this.devices[key]);
  }

  public toggle(deviceUuid: DeviceUuid) {
    const newState = !this.devices[deviceUuid].isOn;
    this.devices[deviceUuid].isOn = newState;
  }
}
