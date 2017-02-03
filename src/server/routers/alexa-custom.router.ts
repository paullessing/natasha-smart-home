import * as express from 'express';
import {BodyParsed, Post, Response} from 'express-router-decorators';

import {Service} from '../../util';
import {DeviceService} from '../devices';
import {Authenticated} from '../auth';
import {Response as CustomSkillResponse, Intent, Slot} from '../alexa/interfaces/custom-skill'
import {AlexaCustomSkillService} from '../alexa/alexa-custom-skill.service';

enum DeviceState {
  ON, OFF
}

@Service()
export class AlexaCustomSkillRouter {

  constructor(
    private deviceService: DeviceService,
    private alexaService: AlexaCustomSkillService
  ) {}

  @BodyParsed()
  // @Authenticated()
  @Post('/')
  public postRequest(req: express.Request): Promise<Response> {
    // console.log('Alexa\n======');
    // console.log(req.method);
    // console.log('======');
    // Object.keys(req.headers).forEach(header => console.log(`${header} : ${req.headers[header]}`));
    // console.log('======');
    // console.log(req.body);

    if (req.body && req.body.request && req.body.request.type === 'IntentRequest' && req.body.request.intent) {
      const intent: Intent<{ item: Slot }> = req.body.request.intent;

      const slots = intent.slots;
      const item = slots.item && slots.item.value || 'thing';

      const response = this.selectResponse(intent.name, item);
      console.log('Response', response);

      return Response.resolve(response);
    } else {
      return Response.reject(400);
    }
  }

  private selectResponse(intentName: string, itemName: string) {
    switch (intentName) {
      case 'GetThingState':
        return this.handleGetStateRequest(itemName);
      case 'TurnThingOn':
        return this.handleToggleRequest(itemName, DeviceState.ON);
      case 'TurnThingOff':
        return this.handleToggleRequest(itemName, DeviceState.OFF);
      default:
        console.error('Unknown intent:', intentName);
        return this.alexaService.createPlainSpeechResponse(`I'm sorry Dave, I'm afraid I can't do that.`);
    }
  }

  private handleGetStateRequest(itemName: string): CustomSkillResponse {
    const device = this.deviceService.getDeviceByName(itemName);
    if (!device) {
      return this.alexaService.createPlainSpeechResponse('Device not found.');
    } else {
      return this.alexaService.createPlainSpeechResponse(`Currently ${device.isOn ? 'on' : 'off'}.`);
    }
  }

  private handleToggleRequest(itemName: string, targetState: DeviceState): CustomSkillResponse {
    const turnOn = (targetState === DeviceState.ON);
    console.log('Device name', itemName);
    const device = this.deviceService.getDeviceByName(itemName);
    if (!device) {
      return this.alexaService.createPlainSpeechResponse('Device not found.');
    } else if (device.isOn === turnOn) {
      return this.alexaService.createPlainSpeechResponse(`That was already ${turnOn ? 'on' : 'off'}.`);
    }
    this.deviceService.toggle(device.id);
    return this.alexaService.createPlainSpeechResponse(`OK, I've turned the ${itemName} ${turnOn ? 'on' : 'off'}.`);
  }
}
