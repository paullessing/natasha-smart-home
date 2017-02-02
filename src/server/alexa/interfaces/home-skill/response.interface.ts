import {Header} from './header.interface';
import {Appliance} from './appliance.interface';

export interface Response {
  header: Header;
  payload: {};
}

export interface DiscoveryResponse extends Response {
  payload: {
    discoveredAppliances: Appliance[];
  };
}
