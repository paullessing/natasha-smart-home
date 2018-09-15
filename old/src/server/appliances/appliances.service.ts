import {Service} from '../../util';
import {DeviceService} from '../devices';
import {Appliance, ApplianceId} from '../../shared/appliance.interface';
import {ApplianceConverter} from './appliance.converter';
import {Device} from '../devices/device.interface';

@Service()
export class ApplianceService {
  constructor(
    private deviceService: DeviceService,
    private applianceConverter: ApplianceConverter
  ) {
  }

  public getAll(): Appliance[] {
    return this.deviceService.getDevices()
      .map(device => this.applianceConverter.convertDevice(device))
      .reduce((a, b) => a.concat(b), []);
  }

  public toggle(id: ApplianceId): Promise<Appliance> {
    return Promise.resolve()
      .then(() => {
        return this.deviceService.getDeviceOrThrow(id);
      })
      .then((device: Device) => {
        return this.deviceService.setState(device.id, !device.isOn);
      })
      .then((device: Device) => this.applianceConverter.convertDevice(device)[0]); // TODO this is weird
  }
}
