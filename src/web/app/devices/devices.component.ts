import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';

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
    this.http.get('http://localhost:8080/api/devices')
      .subscribe(
        (deviceResponse: Response) => this.devices = deviceResponse.json()
      );
  }

  public toggle(device): void {
    this.http.post(`http://localhost:8080/api/devices/${device.id}/toggle`, null)
      .subscribe(
        (response: Response) => device.isOn = response.json().isOn
      );
  }
}
