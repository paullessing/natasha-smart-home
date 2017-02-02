import {ErrorResponseName} from './error-response-name.enum';

export type ResponseName =
  'DiscoverAppliancesResponse'
    | 'TurnOnConfirmation'
    | 'TurnOffConfirmation'
    | 'SetTargetTemperatureConfirmation'
    | 'IncrementTargetTemperatureConfirmation'
    | 'DecrementTargetTemperatureConfirmation'
    | 'SetPercentageConfirmation'
    | 'IncrementPercentageConfirmation'
    | 'DecrementPercentageConfirmation'
    | 'HealthCheckResponse'
    | ErrorResponseName;

export class ResponseNames {
  public static DISCOVER_APPLIANCES: ResponseName = 'DiscoverAppliancesResponse';
  public static TURN_ON_CONFIRMATION: ResponseName = 'TurnOnConfirmation';
  public static TURN_OFF_CONFIRMATION: ResponseName = 'TurnOffConfirmation';
  public static TEMPERATURE_SET_CONFIRMATION: ResponseName = 'SetTargetTemperatureConfirmation';
  public static TEMPERATURE_INCREMENT_CONFIRMATION: ResponseName = 'IncrementTargetTemperatureConfirmation';
  public static TEMPERATURE_DECREMENT_CONFIRMATION: ResponseName = 'DecrementTargetTemperatureConfirmation';
  public static PERCENTAGE_SET_CONFIRMATION: ResponseName = 'SetPercentageConfirmation';
  public static PERCENTAGE_INCREMENT_CONFIRMATION: ResponseName = 'IncrementPercentageConfirmation';
  public static PERCENTAGE_DECREMENT_CONFIRMATION: ResponseName = 'DecrementPercentageConfirmation';
  public static HEALTH_CHECK: ResponseName = 'HealthCheckResponse';
}
