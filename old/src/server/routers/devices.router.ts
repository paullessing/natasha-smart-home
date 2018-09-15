import * as express from 'express';
import {Get, Response, Post, Put, BodyParsed} from 'express-router-decorators';
import * as log from 'winston';

import {Service} from '../../util';
import {
  Device,
  DeviceService,
  DeviceNotFoundError,
  DeviceUpdateResult,
  DeviceUpdateType,
  DeviceValidationError
} from '../devices';

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

  @Put('/:deviceId')
  @BodyParsed()
  //@Authenticated()
  public putDevice(req: express.Request): Promise<Response> {
    return Promise.resolve(this.deviceService.createOrUpdateDevice(req.params['deviceId'], req.body))
      .then((result: DeviceUpdateResult) => {
        const responseCode = result.type === DeviceUpdateType.CREATED ? 201 : 200;
        return Response.success(responseCode, result.device);
      })
      .catch((error: DeviceValidationError) => {
        if (error instanceof DeviceValidationError) {
          return Response.error(409, error.message);
        }
        throw error; // Rethrow, let the 500 handler deal with it
      });
  }

  @Post('/:deviceId/toggle')
  //@Authenticated()
  public toggleDevice(req: express.Request): Promise<Response> {
    return Promise.resolve()
      .then(() => {
        return this.deviceService.getDeviceOrThrow(req.params['deviceId']);
      })
      .then((device: Device) => {
        return this.deviceService.setState(device.id, !device.isOn);
      })
      .then((device: Device) => Response.success(device))
      .catch((err: any) => this.handleDeviceNotExistsError(err));
  }

  @Get('/locations/all')
  //@Authenticated()
  public getAllLocations(): Promise<Response> {
    return Promise.resolve()
      .then(() => this.deviceService.getAllLocations())
      .then((locations) => Response.success(locations));
  }

  private handleDeviceNotExistsError(err: any): Promise<Response> {
    log.error('Error', err);
    if (err instanceof DeviceNotFoundError) {
      const deviceId = (err as DeviceNotFoundError).deviceId;
      return Response.resolve(404, `Device does not exist: ${deviceId}`);
    }
    return Promise.reject(err);
  }
}
