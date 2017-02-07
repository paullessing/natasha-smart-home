import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';
import {config} from '../../environments/environment';

@Component({
  selector: 'nsh-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  public devices: any[];

  constructor(
    private http: Http
  ) { }

  public ngOnInit() {
    this.http.get(`${config.apiHost}/api/devices`)
      .subscribe(
        (deviceResponse: Response) => this.devices = deviceResponse.json()
      );
  }

  public toggle(device): void {
    this.http.post(`${config.apiHost}/api/devices/${device.id}/toggle`, null)
      .subscribe(
        (response: Response) => device.isOn = response.json().isOn
      );
  }
}
