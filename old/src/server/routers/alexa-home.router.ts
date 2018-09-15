import * as express from 'express';
import {BodyParsed, Post, Response} from 'express-router-decorators';
import * as log from 'winston';

import {Service} from '../../util';
import {Authenticated} from '../auth';
import {DeviceService, DeviceNotFoundError} from '../devices';
import {AlexaHomeSkillService} from '../alexa/alexa-home-skill.service';
import {
  Request,
  TurnOnOffRequest,
  Namespaces,
  Response as SkillResponse,
  ErrorResponseNames,
  RequestNames,
  ResponseNames
} from '../alexa/interfaces/home-skill';

@Service()
export class AlexaHomeSkillRouter {

  constructor(
    private deviceService: DeviceService,
    private alexaService: AlexaHomeSkillService
  ) {}

  @BodyParsed()
  @Authenticated()
  @Post('/')
  public handleRequest(req: express.Request): Promise<Response> {
    const request = req.body as Request;
    if (request.header.namespace === Namespaces.DISCOVERY) {
      return this.discoverDevices()
        .then((response: SkillResponse) => Response.success(response));
    } else if (request.header.namespace === Namespaces.CONTROL) {
      return this.handleControl(request)
        .then((response: SkillResponse) => Response.success(response));
    } else {
      return Response.resolve(this.alexaService.createErrorResponse(ErrorResponseNames.UNSUPPORTED_OPERATION));
    }
  }

  private discoverDevices(): Promise<SkillResponse> {
    const devices = this.deviceService.getDevices();
    const result = this.alexaService.createDiscoveryResponse(devices);
    return Promise.resolve(result);
  }

  private handleControl(request: Request): Promise<SkillResponse> {
    // TODO move to service, this is too much logic for a router
    return Promise.resolve().then(() => {
      log.debug('Control', request);
      if (request.header.name === RequestNames.TURN_ON || request.header.name === RequestNames.TURN_OFF) {
        const turnOnOffReq = request as TurnOnOffRequest;
        const deviceId = turnOnOffReq.payload.appliance.applianceId;

        try {
          const turnOn = request.header.name === RequestNames.TURN_ON;
          this.deviceService.setState(deviceId, turnOn);
          return this.alexaService.createSuccessResponse(turnOn ? ResponseNames.TURN_ON_CONFIRMATION : ResponseNames.TURN_OFF_CONFIRMATION);
        } catch (err) {
          if (err instanceof DeviceNotFoundError) {
            log.warn('Device not found', deviceId);
            return this.alexaService.createErrorResponse(ErrorResponseNames.UNSUPPORTED_TARGET);
          } else {
            log.error(err);
            return this.alexaService.createErrorResponse(ErrorResponseNames.DRIVER_INTERNAL);
          }
        }
      }
      log.warn('Unexpected command', request.header.name);
      return this.alexaService.createErrorResponse(ErrorResponseNames.UNSUPPORTED_OPERATION);
    });
  }
}
