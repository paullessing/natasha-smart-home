import * as express from 'express';
import {Get, Response, Post} from 'express-router-decorators';

import {Service} from '../../util';
import {Device, DeviceService, DeviceNotFoundError} from '../devices';

@Service()
export class DeviceRouter {

  constructor(
    private deviceService: DeviceService
  ) {}

  @Get('/')
  public getDevices(): Promise<Response> {
    return Response.resolve(this.deviceService.getDevices());
  }

  @Get('/:deviceId')
  public getDevice(req: express.Request): Promise<Response> {
    return Promise.resolve(this.deviceService.getDevice(req.params['deviceId']))
      .then((device: Device) => Response.success(device))
      .catch((err: any) => this.handleDeviceNotExistsError(err));
  }

  @Post('/:deviceId/toggle')
  public toggleDevice(req: express.Request): Promise<Response> {
    return Promise.resolve(this.deviceService.toggle(req.params['deviceId']))
      .then((device: Device) => Response.success(device))
      .catch((err: any) => this.handleDeviceNotExistsError(err));
  }

  private handleDeviceNotExistsError(err: any): Promise<Response> {
    console.log('Error', err);
    if (err instanceof DeviceNotFoundError) {
      const deviceId = (err as DeviceNotFoundError).deviceId;
      return Response.resolve(404, `Device does not exist: ${deviceId}`);
    }
    return Promise.reject(err);
  }
}
