export type DeviceUuid = string;

export interface Device {
  name: string;
  id: DeviceUuid;
  isOn: boolean;
}
