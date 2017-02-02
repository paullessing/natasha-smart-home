import {Use, UseType, Get, Response} from 'express-router-decorators';

import {Service} from '../../util';
import {DeviceRouter} from './devices.router';
import {AlexaRouter} from './alexa.router';

@Service()
export class ApiRouter {

  @Use('/alexa', UseType.ROUTER)
  public alexaRouter: AlexaRouter;

  @Use('/devices', UseType.ROUTER)
  public deviceRouter: DeviceRouter;

  constructor(
    alexaRouter: AlexaRouter,
    deviceRouter: DeviceRouter
  ) {
    this.alexaRouter = alexaRouter;
    this.deviceRouter = deviceRouter;
  }

  @Get('/health')
  public getHealth(): Promise<Response> {
    return Response.resolve('OK');
  }
}
