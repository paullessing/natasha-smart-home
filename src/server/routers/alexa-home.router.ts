import * as express from 'express';
import {BodyParsed, Post, Response} from 'express-router-decorators';

import {Service} from '../../util';
import {DeviceService} from '../devices';
import {Authenticated} from '../auth';
import {AlexaHomeSkillService} from '../alexa/alexa-home-skill.service';

@Service()
export class AlexaHomeSkillRouter {

  constructor(
    private deviceService: DeviceService,
    private alexaService: AlexaHomeSkillService
  ) {}

  @BodyParsed()
  @Authenticated()
  @Post('/discovery')
  public homeDiscovery(req: express.Request): Promise<Response> {
    const devices = this.deviceService.getDevices();
    const result = this.alexaService.createDiscoveryResponse(devices);
    return Response.resolve(result);
  }
}
