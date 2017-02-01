export type DeviceId = string;

export interface Device {
  name: string;
  id: DeviceId;
  isOn: boolean;
  location?: string;
}
