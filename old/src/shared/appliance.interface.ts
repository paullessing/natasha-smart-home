export type ApplianceId = string;

export interface Appliance {
  id: ApplianceId;
  location: string;
  name: string;
  isOn: boolean;
  isToggleOnly: boolean;
}
