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
  private devices: Device[];
  private devicesById: DeviceMap;
  private devicesByName: DeviceMap;

  constructor(
    @inject(PERSISTENCE) private storage: Persistence,
    private commService: CommunicationService
  ) {
    this.devices = [];
    this.devicesById = {};
    this.devicesByName = {};

    this.loadDevices(); // This is async; we're hoping that no calls to this class are made before it's finished loading.
    // TODO Inversify has a loading mechanism for this but I need to investigate.
  }

  public getDevices(): Device[] {
    return this.devices.slice();
  }

  public getDevice(deviceId: string): Device | null {
    return this.devicesById[deviceId];
  }

  public getDeviceByName(deviceName: string): Device | null {
    return this.devicesByName[deviceName.toLowerCase()] || null;
  }

  public createOrUpdateDevice(id: DeviceId, device: Device): Promise<DeviceUpdateResult> {
    return Promise.resolve()
      .then(() => this.validateNewDevice(id, device))
      .then(() => this.getDevice(id))
      .then((existingDevice: Device) => {
        const isCreate = !existingDevice;
        const newDevice = {
          name: device.name,
          id: id,
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

  public getAllLocations(): string[] {
    const locations: string[] = [];
    const usedLocations = {};
    this.devices.map(device => device.location).forEach(location => {
      if (!usedLocations[location]) {
        locations.push(location);
        usedLocations[location] = true;
      }
    });
    return locations;
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
    this.devices.push(device);
    this.devicesById[device.id] = device;
    this.devicesByName[device.name.toLowerCase()] = device;
  }

  private persist(device: Device): Promise<Device> {
    return this.storage.put(PERSISTENCE_KEY_PREFIX + device.id, device)
      .then(() => this.storage.put(PERSISTENCE_KEY_LIST, Object.keys(this.devicesById)))
      .then(() => device);
  }

  private validateNewDevice(id: DeviceId, device: Device): void {
    if (id !== device.id) {
      throw new DeviceValidationError(id, 'Device ID does not match ' + id + ' ' + device.id);
    }
    if (!device.name) {
      throw new DeviceValidationError(id, 'Missing field: name');
    }
    if (!device.commands) {
      throw new DeviceValidationError(id, 'Missing field: commands');
    }
    if (!device.location) {
      throw new DeviceValidationError(id, 'Missing field: location');
    }
    if (Object.keys(device.commands).length === 0) {
      throw new DeviceValidationError(id, 'Device must have commands');
    }
  }
}
