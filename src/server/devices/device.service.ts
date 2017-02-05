import {inject} from 'inversify';

import {Service, CustomError} from '../../util';
import {Persistence, PERSISTENCE} from '../persistence';
import {CommunicationService} from '../communication';
import {Device, DeviceId} from './device.interface';

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
    @inject(PERSISTENCE) private persistence: Persistence,
    private commService: CommunicationService
  ) {
    this.devicesById = {};
    this.devicesByName = {};

    this.persistence.get<Device[]>(PERSISTENCE_KEY)
      .then((devices: Device[]) => {
        if (devices) {
          for (const device of devices) {
            this.addDevice(device);
          }
        }
      });
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

  public setState(deviceId: DeviceId, turnOn: boolean): Device {
    const device = this.getDeviceOrThrow(deviceId);
    this.commService.turnDeviceOnOrOff(device, turnOn); // Send that command anyway in case it's out of sync

    if (turnOn === device.isOn) {
      return device;
    }

    device.isOn = turnOn;
    console.log('2 Turned on', turnOn);
    this.persistDevices();

    return device;
  }

  private getDeviceOrThrow(deviceId: DeviceId): Device {
    const device = this.getDevice(deviceId);
    if (!device) {
      throw new DeviceNotFoundError(deviceId);
    }
    return device;
  }

  private addDevice(device: Device): void {
    this.devicesById[device.id] = device;
    this.devicesByName[device.name.toLowerCase()] = device;
  }

  private persistDevices(): void {
    this.persistence.put(PERSISTENCE_KEY, this.getDevices());
  }
}
