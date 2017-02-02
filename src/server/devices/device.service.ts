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
  [key: string]: Device;
}

const PERSISTENCE_KEY = 'devices';

@Service()
export class DeviceService {
  private devicesById: DeviceMap;
  private devicesByName: DeviceMap;

  constructor(
    @inject(PERSISTENCE) private persistence: Persistence
  ) {
    this.devicesById = {};
    this.devicesByName = {};

    const devices = this.persistence.get<Device[]>(PERSISTENCE_KEY);
    if (devices) {
      for (const device of devices) {
        this.addDevice(device);
      }
    } else { // TODO this is placeholder code until I use real persistence
      this.addDevice({
        name: 'Sofa Light',
        id: 'light-lr-sofa',
        isOn: false
      });
    }
  }

  public getDevices(): Device[] {
    return Object.keys(this.devicesById).map(key => this.devicesById[key]);
  }

  public getDevice(deviceId: string): Device | null {
    return this.devicesById[deviceId] || null;
  }

  public getDeviceByName(deviceName: string): Device | null {
    return this.devicesByName[deviceName.toLowerCase()] || null;
  }

  public toggle(deviceId: DeviceId): Device {
    const device = this.getDevice(deviceId);
    if (!device) {
      throw new DeviceNotFoundError(deviceId);
    }

    const newState = !device.isOn;
    device.isOn = newState;
    this.persistDevices(); // TODO this needs better handling. Maybe a device config stored separately from states?

    return device;
  }

  private addDevice(device: Device): void {
    this.devicesById[device.id] = device;
    this.devicesByName[device.name.toLowerCase()] = device;

    this.persistDevices();
  }

  private persistDevices(): void {
    this.persistence.put(PERSISTENCE_KEY, this.getDevices());
  }
}
