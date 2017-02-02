import {Header} from './header.interface';
import {AdditionalApplianceDetails} from './appliance.interface';

interface BasePayload {
  accessToken: string; // OAuth token
}

export interface Request {
  header: Header;
  payload: BasePayload;
}

export interface DiscoverAppliancesRequest extends Request {}

export interface TurnOnRequest extends Request {
  payload: BasePayload & {
    appliance: {
      applianceId: string;
      additionalApplianceDetails: AdditionalApplianceDetails;
    }
  }
}

export type TurnOffRequest = TurnOnRequest;
