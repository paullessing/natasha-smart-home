import {Get, Response} from 'express-router-decorators';

import {Service} from '../../util';

@Service()
export class RootRouter {

  @Get('/')
  public getRoot(): Promise<Response> {
    return Response.resolve({ foo: 'bar' });
  }
}
