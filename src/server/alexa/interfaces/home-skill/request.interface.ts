import {Header} from './header.interface';
import {Appliance} from './appliance.interface';
import {RequestNames} from './request-name.enum';

export interface Request {
  header: Header;
  payload: {};
}

export interface DiscoverAppliancesRequest extends Request {
  payload: {
    accessToken: string; // OAuth token
  }
}
