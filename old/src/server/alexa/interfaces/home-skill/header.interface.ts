import {RequestName} from './request-name.enum';
import {ResponseName} from './response-name.enum';
import {Namespace} from './namespace.enum';

export interface Header {
  messageId: string;
  name: RequestName | ResponseName;
  namespace: Namespace;
  payloadVersion: string; // Current: 2
}
