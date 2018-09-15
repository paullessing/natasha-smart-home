export type ApplianceAction =
  'setTargetTemperature'
    | 'incrementTargetTemperature'
    | 'decrementTargetTemperature'
    | 'setPercentage'
    | 'incrementPercentage'
    | 'decrementPercentage'
    | 'turnOff'
    | 'turnOn';

export class ApplianceActions {
  public static TEMPERATURE_SET: ApplianceAction = 'setTargetTemperature';
  public static TEMPERATURE_INCREMENT: ApplianceAction = 'incrementTargetTemperature';
  public static TEMPERATURE_DECREMENT: ApplianceAction = 'decrementTargetTemperature';
  public static PERCENTAGE_SET: ApplianceAction = 'setPercentage';
  public static PERCENTAGE_INCREMENT: ApplianceAction = 'incrementPercentage';
  public static PERCENTAGE_DECREMENT: ApplianceAction = 'decrementPercentage';
  public static TURN_OFF: ApplianceAction = 'turnOff';
  public static TURN_ON: ApplianceAction = 'turnOn';
}
