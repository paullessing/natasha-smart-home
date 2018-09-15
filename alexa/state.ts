export interface State {
  state: 'None' | 'Weight' | 'Notification';
}
export interface DefaultState extends State {
  state: 'None';
}
export const DEFAULT_STATE = {
  state: 'None'
};
export function isDefault(state: State): state is DefaultState {
  return state.state === 'None';
}

export interface BuildingWeightState extends State {
  state: 'Weight';
  itemName: string | null;
  weight: number | null;
}
export function isBuildingWeight(state: State): state is BuildingWeightState {
  return state.state === 'Weight';
}

export interface NotificationState extends State {
  state: 'Notification';
  notification: string;
}
export function isNotification(state: State): state is NotificationState {
  return state.state === 'Notification';
}
