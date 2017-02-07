import {inject} from 'inversify';
import * as log from 'winston';

import {Service, CustomError} from '../../util';
import {Persistence, PERSISTENCE} from '../persistence';
import {CommunicationService} from '../communication';
import {Device, DeviceId} from './device.interface';

export class DeviceNotFoundError extends CustomError {
  constructor(public deviceId: DeviceId) {
    super(`Device ${deviceId} not found`);
  }
}

export class DeviceValidationError extends CustomError {
  constructor(public deviceId: DeviceId, public message: string) {
    super(`Cannot persist device ${deviceId}: ${message}`);
  }
}

export enum DeviceUpdateType {
  CREATED,
  UPDATED
}

export interface DeviceUpdateResult {
  type: DeviceUpdateType;
  device: Device;
}

interface DeviceMap {
  [key: string]: Device;
}

const PERSISTENCE_KEY_LIST = 'deviceIds';
const PERSISTENCE_KEY_PREFIX = 'device--';

@Service()
export class DeviceService {
  private devicesById: DeviceMap;
  private devicesByName: DeviceMap;

  constructor(
    @inject(PERSISTENCE) private storage: Persistence,
    private commService: CommunicationService
  ) {
    this.devicesById = {};
    this.devicesByName = {};

    this.loadDevices(); // This is async; we're hoping that no calls to this class are made before it's finished loading.
    // TODO Inversify has a loading mechanism for this but I need to investigate.
  }

  public getDevices(): Device[] {
    return Object.keys(this.devicesById).map(key => this.devicesById[key]);
  }

  public getDevice(deviceId: string): Device | null {
    return this.devicesById[deviceId];
  }

  public getDeviceByName(deviceName: string): Device | null {
    return this.devicesByName[deviceName.toLowerCase()] || null;
  }

  public createOrUpdateDevice(deviceId: string, device: Device): Promise<DeviceUpdateResult> {
    return Promise.resolve()
      .then(() => {
        if (deviceId !== device.id) {
          throw new DeviceValidationError(deviceId, 'Device ID does not match ' + deviceId + ' ' + device.id);
        }
        if (!device.name) {
          throw new DeviceValidationError(deviceId, 'Missing field: name');
        }
        if (!device.commands) {
          throw new DeviceValidationError(deviceId, 'Missing field: commands');
        }
        if (Object.keys(device.commands).length === 0) {
          throw new DeviceValidationError(deviceId, 'Device must have commands');
        }
      })
      .then(() => this.getDevice(deviceId))
      .then((existingDevice: Device) => {
        const isCreate = !existingDevice;
        const newDevice = {
          name: device.name,
          id: deviceId,
          isOn: (isCreate ? device.isOn : existingDevice.isOn) || false,
          location: device.location,
          commands: {
            on: device.commands.on || undefined,
            off: device.commands.off || undefined,
            toggle: device.commands.toggle || undefined
          }
        };

        return this.persist(newDevice)
          .then((persistedDevice: Device) => {
            this.addDevice(persistedDevice);
            return {
              type: isCreate ? DeviceUpdateType.CREATED : DeviceUpdateType.UPDATED,
              device: persistedDevice
            };
          });
      });
  }

  public setState(deviceId: DeviceId, turnOn: boolean): Device {
    const device = this.getDeviceOrThrow(deviceId);
    this.commService.turnDeviceOnOrOff(device, turnOn); // Send that command anyway in case it's out of sync

    if (turnOn === device.isOn) {
      return device;
    }

    device.isOn = turnOn;
    this.persist(device);

    return device;
  }

  private loadDevices(): void {
    this.storage.get<DeviceId[]>(PERSISTENCE_KEY_LIST)
      .then((deviceIds: DeviceId[]) => {
        if (!deviceIds) {
          return;
        }
        return Promise.all(deviceIds
          .map((id: DeviceId) => this.storage.get(PERSISTENCE_KEY_PREFIX + id).then((device: Device) => {
            if (!device) {
              log.error(`Device not found: ${id}`);
            }
            return device;
          }))
        ).then((devices: Device[]) => {
          devices
            .filter((device: Device) => !!device)
            .forEach((device: Device) => this.addDevice(device));
        });
      });
  }

  public getDeviceOrThrow(deviceId: DeviceId): Device {
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

  private persist(device: Device): Promise<Device> {
    return this.storage.put(PERSISTENCE_KEY_PREFIX + device.id, device)
      .then(() => this.storage.put(PERSISTENCE_KEY_LIST, Object.keys(this.devicesById)))
      .then(() => device);
  }
}
