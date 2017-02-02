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

export interface Header {
  messageId: string;
  name: string; // TODO these are probably an enum
  namespace: string; // 'Alexa.ConnectedHome.Discovery' | 'Alexa.ConnectedHome.Control';
  payloadVersion: string; // Current: 2
}

export interface DiscoveryResponse {
  header: {
    namespace: 'Alexa.ConnectedHome.Discovery';
    name: 'DiscoverAppliancesResponse';
    payloadVersion: '2';
  };
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
