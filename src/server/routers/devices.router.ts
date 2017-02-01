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

  @Get('/:deviceUuid')
  public getDevice(req: express.Request): Promise<Response> {
    return Promise.resolve(this.deviceService.getDevice(req.params['deviceUuid']))
      .then((device: Device) => Response.success(device))
      .catch((err: any) => this.handleDeviceNotExistsError(err));
  }

  @Post('/:deviceUuid/toggle')
  public toggleDevice(req: express.Request): Promise<Response> {
    return Promise.resolve(this.deviceService.toggle(req.params['deviceUuid']))
      .then((device: Device) => Response.success(device))
      .catch((err: any) => this.handleDeviceNotExistsError(err));
  }

  private handleDeviceNotExistsError(err: any): Promise<Response> {
    if (err instanceof DeviceNotFoundError) {
      const deviceUuid = (err as DeviceNotFoundError).deviceUuid;
      return Response.resolve(404, `Device does not exist: ${deviceUuid}`);
    }
    return Promise.reject(err);
  }
}
