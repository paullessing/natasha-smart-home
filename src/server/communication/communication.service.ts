import * as mqtt from 'mqtt';
import * as log from 'winston';

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
      log.debug('MQTT Connected');
      client.subscribe('/#');
      this.client = client;
    });

    client.on('error', (err) => {
      log.error('MQTT Error', err);
    });

    client.on('message', (topic, message) => {
      log.debug('MQTT:', topic, message.toString());
    });
  }

  public turnDeviceOnOrOff(device: Device, turnOn: boolean) {
    if (!this.client) {
      throw new Error('Client could not connect to MQTT server');
    }
    if (turnOn) {
      this.executeCommand(device.commands.on);
    } else {
      this.executeCommand(device.commands.off);
    }
  }

  private executeCommand(command?: Command): void {
    if (!command || command.type !== CommandTypes.MQTT) {
      return;
    }
    if (!this.client) {
      throw new Error('Client could not connect to MQTT server');
    }
    const mqttCommand = command as MqttCommand;
    this.client.publish(mqttCommand.topic, mqttCommand.message);
  }
}
