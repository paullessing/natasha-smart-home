import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';

import {config} from '../../environments/environment';
import {Appliance} from '../../../shared/appliance.interface';

@Component({
  selector: 'nsh-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  public devices: Appliance[];

  constructor(
    private http: Http
  ) { }

  public ngOnInit() {
    this.http.get(`${config.apiHost}/api/appliances`)
      .subscribe(
        (appliancesResponse: Response) => this.devices = appliancesResponse.json()
      );
  }

  public toggle(device): void {
    this.http.post(`${config.apiHost}/api/appliances/${device.id}/toggle`, null)
      .subscribe(
        (response: Response) => device.isOn = response.json().isOn
      );
  }
}
