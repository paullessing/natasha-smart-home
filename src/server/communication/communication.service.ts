import * as mqtt from 'mqtt';

import {Service} from '../../util';
import {Device} from '../devices/device.interface';
import {CommandTypes} from '../devices/command-types.enum';
import {MqttCommand, Command} from '../devices/command.interface';

@Service()
export class CommunicationService {

  private client: mqtt.Client;

  constructor() {}

  public connect(): void {
    const client = mqtt.connect('tcp://mqtt-server.home');
    client.on('connect', () => {
      console.log('Connected');
      client.subscribe('/#');
      this.client = client;
    });

    client.on('error', (err) => {
      console.error('Error', err);
    });

    client.on('message', (topic, message) => {
      console.log('Topic', topic);
      console.log('Message', message.toString());
    });
  }

  public turnDeviceOn(device: Device): void {
    this.executeCommand(device.commands.on);
  }

  public turnDeviceOff(device: Device): void {
    this.executeCommand(device.commands.off);
  }

  private executeCommand(command?: Command): void {
    if (!command || command.type !== CommandTypes.MQTT) {
      return;
    }
    const mqttCommand = command as MqttCommand;
    this.client.publish(mqttCommand.topic, mqttCommand.message);
  }
}
