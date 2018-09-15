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
    | 'UnexpectedInformationReceivedError';

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
