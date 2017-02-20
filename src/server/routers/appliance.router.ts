import * as express from 'express';
import {Get, Response, Post} from 'express-router-decorators';
import * as log from 'winston';

import {Service} from '../../util';
import {ApplianceService} from '../appliances/appliances.service';
import {Appliance} from '../../shared/appliance.interface';
import {DeviceNotFoundError} from '../devices/device.service';

@Service()
export class ApplianceRouter {

  constructor(
    private applianceService: ApplianceService
  ) {}

  @Get('/')
  public getAppliances(): Promise<Response> {
    return Response.resolve(this.applianceService.getAll());
  }

  @Post('/:applianceId/toggle')
  //@Authenticated()
  public toggleAppliance(req: express.Request): Promise<Response> {
    return Promise.resolve()
      .then(() => this.applianceService.toggle(req.params['applianceId']))
      .then((appliance: Appliance) => Response.success(appliance))
      .catch((err: any) => this.handleDeviceNotExistsError(err));
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
