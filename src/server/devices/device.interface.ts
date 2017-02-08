import {Command} from './command.interface';

export type DeviceId = string;

export interface Device {
  name: string;
  id: DeviceId;
  isOn: boolean;
  location: string;
  commands: {
    on?: Command;
    off?: Command;
    toggle?: Command;
  }
}
