import {CommandType} from './command-types.enum';

export interface Command {
  type: CommandType;
}

export interface MqttCommand extends Command {
  topic: string;
  message: string;
}
