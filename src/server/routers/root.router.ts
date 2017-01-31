import {Get, Response, Use, UseType} from 'express-router-decorators';

import {Service} from '../../util';
import {DeviceRouter} from './devices.router';

@Service()
export class RootRouter {

  @Use('/devices', UseType.ROUTER)
  public deviceRouter: DeviceRouter;

  constructor(
    deviceRouter: DeviceRouter
  ) {
    this.deviceRouter = deviceRouter;
  }

  @Get('/')
  public getRoot(): Promise<Response> {
    return Response.resolve({ foo: 'bar' });
  }
}
