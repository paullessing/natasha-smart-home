export type RequestName =
  'DiscoverAppliancesRequest'
    | 'TurnOnRequest'
    | 'TurnOffRequest'
    | 'SetTargetTemperatureRequest'
    | 'IncrementTargetTemperatureRequest'
    | 'DecrementTargetTemperatureRequest'
    | 'SetPercentageRequest'
    | 'IncrementPercentageRequest'
    | 'DecrementPercentageRequest'
    | 'HealthCheckRequest';

export class RequestNames {
  public static DISCOVER: RequestName = 'DiscoverAppliancesRequest';
  public static TURN_ON: RequestName = 'TurnOnRequest';
  public static TURN_OFF: RequestName = 'TurnOffRequest';
  public static TEMPERATURE_SET: RequestName = 'SetTargetTemperatureRequest';
  public static TEMPERATURE_INCREMENT: RequestName = 'IncrementTargetTemperatureRequest';
  public static TEMPERATURE_DECREMENT: RequestName = 'DecrementTargetTemperatureRequest';
  public static PERCENTAGE_SET: RequestName = 'SetPercentageRequest';
  public static PERCENTAGE_INCREMENT: RequestName = 'IncrementPercentageRequest';
  public static PERCENTAGE_DECREMENT: RequestName = 'DecrementPercentageRequest';
  public static HEALTH_CHECK: RequestName = 'HealthCheckRequest';
}
