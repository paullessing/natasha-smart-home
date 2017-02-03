import {inject} from 'inversify';

import {Service, CustomError} from '../../util';
import {Device, DeviceId} from './device.interface';
import {Persistence, PERSISTENCE} from '../persistence';
import {CommandTypes} from './command-types.enum';
import {MqttCommand} from './command.interface';
import {CommunicationService} from '../communication';

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

    const devices = this.persistence.get<Device[]>(PERSISTENCE_KEY);
    if (devices) {
      for (const device of devices) {
        this.addDevice(device);
      }
    } else { // TODO this is placeholder code until I use real persistence
      this.addDevice({
        name: 'Sofa Light',
        id: 'light-lr-sofa',
        isOn: false,
        commands: {
          on: {
            type: CommandTypes.MQTT,
            topic: '/RF_Bridge_in/',
            message: '4542804'
          } as MqttCommand,
          off: {
            type: CommandTypes.MQTT,
            topic: '/RF_Bridge_in/',
            message: '4542807'
          } as MqttCommand
        }
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

    if (newState) {
      this.commService.turnDeviceOn(device);
    } else {
      this.commService.turnDeviceOff(device);
    }

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
