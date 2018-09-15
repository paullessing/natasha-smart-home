import {Use, UseType, Get, Response} from 'express-router-decorators';

import {Service} from '../../util';
import {DeviceRouter} from './devices.router';
import {AlexaRouter} from './alexa.router';
import {ApplianceRouter} from './appliance.router';

@Service()
export class ApiRouter {

  @Use('/alexa', UseType.ROUTER)
  public alexaRouter: AlexaRouter;

  @Use('/devices', UseType.ROUTER)
  public deviceRouter: DeviceRouter;

  @Use('/appliances', UseType.ROUTER)
  public applianceRouter: ApplianceRouter;

  constructor(
    alexaRouter: AlexaRouter,
    deviceRouter: DeviceRouter,
    applianceRouter: ApplianceRouter
  ) {
    this.alexaRouter = alexaRouter;
    this.deviceRouter = deviceRouter;
    this.applianceRouter = applianceRouter;
  }

  @Get('/health')
  public getHealth(): Promise<Response> {
    return Response.resolve('OK');
  }
}
