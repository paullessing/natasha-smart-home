import * as express from 'express';
import {Get, Response, Post} from 'express-router-decorators';

import {Service} from '../../util';
import {DeviceService} from '../devices/device.service';
import {Device} from '../devices/device.interface';

@Service()
export class DeviceRouter {

  constructor(
    private deviceService: DeviceService
  ) {}

  @Get('/')
  public getDevices(): Promise<Response> {
    return Response.resolve(this.deviceService.getDevices());
  }

  @Post('/:deviceUuid/toggle')
  public toggleDevice(req: express.Request): Promise<Response> {
    return Promise.resolve(this.deviceService.toggle(req.params['deviceUuid']))
      .then((device: Device) => Response.success(device));
  }
}
