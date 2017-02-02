import * as express from 'express';
import {AuthenticatedWith} from 'express-router-decorators';
import {interfaces} from 'inversify';
import * as jwt from 'jsonwebtoken';

import {Bindings} from '../../util';

const certificate = `
-----BEGIN CERTIFICATE-----
MIIC+DCCAeCgAwIBAgIJersE4Mj1cLyNMA0GCSqGSIb3DQEBBQUAMCMxITAfBgNV
BAMTGHBhdWxsZXNzaW5nLmV1LmF1dGgwLmNvbTAeFw0xNjA0MTkwOTA0MTJaFw0y
OTEyMjcwOTA0MTJaMCMxITAfBgNVBAMTGHBhdWxsZXNzaW5nLmV1LmF1dGgwLmNv
bTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALENS6v22OuyyeDyNrXo
m2SdpnhcbpZUeoikVi4cu4Brt17FXwMBiFZcnd2bvyhBESBKQ2Dw/67n696tP9Nr
ApwbsPfOisrNw0ZVg4BIuc/KdYCXEZKdxznxXJMmCa2Rb7IsnMZMN6SnjRUgRmiP
2WKFGCvSW5fQWPnB9Y+CL0En9+7XRnWKLRhwN9JufeWhiXUvIelDWnZDUvn1elBk
obTswx67/2DPExFW89kISPUd01Wglc2Csvk8YJud83Xx+udo0blwbULZsWMHmUp9
T8I+GWgtqPMnCeAhhkCfGOwHIvp7QMEKwMnOPBHSMHfl7ZUdIewLAOkNpgQiLch5
IgsCAwEAAaMvMC0wDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQUS+sYckVRL3eYqhkc
9TbmJLLeqeAwDQYJKoZIhvcNAQEFBQADggEBAAJbWeGPv218Mz61ODGA2QpiosGE
pdkL5cDHmT8/uIpuEWcqmAmtDMPbN3tDMebVPeDiNi0/tRdFcRfLBr5RbfBBSKcL
HuprIFHz2I/uenJlnoV3o6WGceykgiXlFYZ1/gmJ2R5KwEoLJltKTfy6yBc7UyA3
xQsRonLa0BDx+VthcUoUpNcLKU5Q2vOj1YdFI6dfH4XMCYFAJITDYU6R7qjGGTbx
z6m+GEwiEdYI1fHqgfzrDzGQoDVXICZQ1xsLB+vvFxEEwRDofmqAmF3h68a49WME
RFJa9K591sX2xouhsXqACkfzNEB3hkTCIcXx7ROaLyU1jG0/oSvY1ZFusSg=
-----END CERTIFICATE-----
`;

@Bindings()
export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public static $bind(bind: interfaces.Bind) {
    bind(AuthService).toConstantValue(AuthService.getInstance());
  }

  public verifyToken(token: string): boolean {
    try {
      const tokenData = jwt.verify(token, certificate);
      if (tokenData.iss !== 'https://paullessing.eu.auth0.com/' || tokenData.aud !== 'natasha') {
        throw new Error('Invalid token data ' + JSON.stringify(tokenData));
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public isRequestAuthenticated(req: express.Request): boolean {
    const token = this.getTokenFromRequest(req);
    console.log('Token', token);
    if (!token) {
      return false;
    }
    return this.verifyToken(token);
  }

  private getTokenFromRequest(req: express.Request): string | null {
    console.log(req.body, req.headers);
    const authHeader = req.headers['authorization'];
    console.log('authHeader', authHeader);
    if (authHeader && authHeader.length && authHeader.indexOf('Bearer ') === 0) {
      return authHeader.substr('Bearer '.length);
    }
    const payloadAccessToken = req.body && req.body.payload && req.body.payload.accessToken;
    console.log('payloadAccessToken', payloadAccessToken);
    if (payloadAccessToken) {
      return payloadAccessToken;
    }
    const userAccessToken = req.body && req.body.context && req.body.context.System && req.body.context.System.user && req.body.context.System.user.accessToken;
    console.log('userAccessToken', userAccessToken);
    if (userAccessToken) {
      return userAccessToken;
    }
    return null;
  }
}

export function Authenticated(): MethodDecorator & PropertyDecorator {
  return AuthenticatedWith((req: express.Request) => {
    return AuthService.getInstance().isRequestAuthenticated(req);
  });
}
