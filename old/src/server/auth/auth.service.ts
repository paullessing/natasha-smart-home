import * as express from 'express';
import {AuthenticatedWith} from 'express-router-decorators';
import {interfaces} from 'inversify';
import * as jwt from 'jsonwebtoken';
import * as log from 'winston';

import {Bindings} from '../../util';
import * as certificates from './certificates';
import Certificate = certificates.Certificate;

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

  public verifyToken(token: string, certificate: Certificate): boolean {
    try {
      const tokenData = jwt.verify(token, certificate);
      if (tokenData.iss !== 'https://paullessing.eu.auth0.com/' || tokenData.aud !== 'natasha') { // TODO this will fail when I add public certs
        throw new Error('Invalid token data ' + JSON.stringify(tokenData));
      }
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  public isRequestAuthenticated(req: express.Request, certificate: Certificate): boolean {
    const token = this.getTokenFromRequest(req);
    if (!token) {
      return false;
    }
    return this.verifyToken(token, certificate);
  }

  private getTokenFromRequest(req: express.Request): string | null {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.length && authHeader.indexOf('Bearer ') === 0) {
      return authHeader.substr('Bearer '.length);
    }
    const payloadAccessToken = req.body && req.body.payload && req.body.payload.accessToken;
    if (payloadAccessToken) {
      return payloadAccessToken;
    }
    const userAccessToken = req.body && req.body.context && req.body.context.System && req.body.context.System.user && req.body.context.System.user.accessToken;
    if (userAccessToken) {
      return userAccessToken;
    }
    return null;
  }
}

export function Authenticated(): MethodDecorator & PropertyDecorator {
  return AuthenticatedWith((req: express.Request) => {
    return AuthService.getInstance().isRequestAuthenticated(req, certificates.NON_INTERACTIVE_CLIENT);
  });
}
