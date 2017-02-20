import {Component} from '../../util';
import {Appliance} from '../../shared/appliance.interface';
import {Device} from '../devices/device.interface';

@Component()
export class ApplianceConverter {

  public convertDevice(device: Device): Appliance[] {
    const baseAppliance: Appliance = {
      id: device.id,
      name: device.name,
      location: device.location,
      isOn: device.isOn,
      isToggleOnly: !!(device.commands.on && device.commands.off)
    };
    const appliances = [baseAppliance];
    if (device.alternativeNames) {
      for (let i = 0; i < device.alternativeNames.length; i++) {
        const name = device.alternativeNames[i];
        appliances.push(Object.assign({}, baseAppliance, { id: device.id + '#' + i, name }));
      }
    }
    return appliances;
  }
}
