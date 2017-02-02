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

export type HeaderNamespace = 'Alexa.ConnectedHome.Discovery' | 'Alexa.ConnectedHome.Control';
export class HeaderNamespaces {
  public static DISCOVERY: HeaderNamespace = 'Alexa.ConnectedHome.Discovery';
  public static CONTROL: HeaderNamespace = 'Alexa.ConnectedHome.Control';
}

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

export type ErrorResponseName =
    'ValueOutOfRangeError'
  | 'TargetOfflineError'
  | 'BridgeOfflineError'
  | 'DriverInternalError'
  | 'DependentServiceUnavailableError'
  | 'TargetConnectivityUnstableError'
  | 'TargetBridgeConnectivityUnstableError'
  | 'TargetFirmwareOutdatedError'
  | 'TargetBridgeFirmwareOutdatedError'
  | 'TargetHardwareMalfunctionError'
  | 'TargetBridgeHardwareMalfunctionError'
  | 'UnwillingToSetValueError'
  | 'RateLimitExceededError'
  | 'NotSupportedInCurrentModeError'
  | 'ExpiredAccessTokenError'
  | 'InvalidAccessTokenError'
  | 'UnsupportedTargetError'
  | 'UnsupportedOperationError'
  | 'UnsupportedTargetSettingError'
  | 'UnexpectedInformationReceivedError'
export class ErrorResponseNames {
  public static VALUE_OUT_OF_RANGE: ErrorResponseName = 'ValueOutOfRangeError';
  public static TARGET_OFFLINE: ErrorResponseName = 'TargetOfflineError';
  public static BRIDGE_OFFLINE: ErrorResponseName = 'BridgeOfflineError';
  public static DRIVER_INTERNAL: ErrorResponseName = 'DriverInternalError';
  public static DEPENDENT_SERVICE_UNAVAILABLE: ErrorResponseName = 'DependentServiceUnavailableError';
  public static TARGET_CONNECTIVITY_UNSTABLE: ErrorResponseName = 'TargetConnectivityUnstableError';
  public static TARGET_BRIDGE_CONNECTIVITY_UNSTABLE: ErrorResponseName = 'TargetBridgeConnectivityUnstableError';
  public static TARGET_FIRMWARE_OUTDATED: ErrorResponseName = 'TargetFirmwareOutdatedError';
  public static TARGET_BRIDGE_FIRMWARE_OUTDATED: ErrorResponseName = 'TargetBridgeFirmwareOutdatedError';
  public static TARGET_HARDWARE_MALFUNCTION: ErrorResponseName = 'TargetHardwareMalfunctionError';
  public static TARGET_BRIDGE_HARDWARE_MALFUNCTION: ErrorResponseName = 'TargetBridgeHardwareMalfunctionError';
  public static UNWILLING_TO_SET_VALUE: ErrorResponseName = 'UnwillingToSetValueError';
  public static RATE_LIMIT_EXCEEDED: ErrorResponseName = 'RateLimitExceededError';
  public static NOT_SUPPORTED_IN_CURRENT_MODE: ErrorResponseName = 'NotSupportedInCurrentModeError';
  public static EXPIRED_ACCESS_TOKEN: ErrorResponseName = 'ExpiredAccessTokenError';
  public static INVALID_ACCESS_TOKEN: ErrorResponseName = 'InvalidAccessTokenError';
  public static UNSUPPORTED_TARGET: ErrorResponseName = 'UnsupportedTargetError';
  public static UNSUPPORTED_OPERATION: ErrorResponseName = 'UnsupportedOperationError';
  public static UNSUPPORTED_TARGET_SETTING: ErrorResponseName = 'UnsupportedTargetSettingError';
  public static UNEXPECTED_INFORMATION_RECEIVED: ErrorResponseName = 'UnexpectedInformationReceivedError';
}

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

export interface Header {
  messageId: string;
  name: RequestName | ResponseName;
  namespace: HeaderNamespace;
  payloadVersion: string; // Current: 2
}

export interface DiscoveryResponse {
  header: Header;
  payload: {
    discoveredAppliances: DiscoveredAppliance[];
  };
}

export interface DiscoveredAppliance {
  /**
   *  A device identifier.
   *  The identifier must be unique across all devices owned by an end user within the domain for the skill adapter.
   *  In addition, the identifier needs to be consistent across multiple discovery requests for the same device.
   *  An identifier can contain any letter or number and the following special characters: _ - = # ; : ? @ &.
   *  The identifier cannot exceed 256 characters.
   */
   applianceId: string;

  /**
   *  The name of the device manufacturer. This value cannot exceed 128 characters.
   */
   manufacturerName: string;

  /**
   *  Device model name. This value cannot exceed 128 characters.
   */
   modelName: string;

  /**
   *  The vendor-provided version of the device. This value cannot exceed 128 characters.
   */
   version: string;

  /**
   *  The name used by the customer to identify the device.
   *  This value cannot exceed 128 characters and should not contain special characters or punctuation.
   */
   friendlyName: string;

  /**
   *  A human-readable description of the device.
   *  This value cannot exceed 128 characters.
   *  The description should contain a description of how the device is connected.
   *  For example, "WiFi Thermostat connected via Wink".
   */
   friendlyDescription: string;

  /**
   * true to indicate the device is currently reachable; otherwise, false.	Yes
   */
   isReachable: boolean;

  /**
   *  An array of actions that this device supports.
   */
  actions: ApplianceAction[];

  /**
   * A list of string name-value pairs that provide additional information about a device for use by the skill adapter.
   * The contents of this property cannot exceed 5000 bytes.
   * Also, the Smart Home Skill API does not understand or use this data.
   */
  additionalApplianceDetails?: { [key: string]: string };
}
