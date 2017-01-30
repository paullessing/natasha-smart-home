import {Use, UseType} from 'express-router-decorators';

import {AlexaRouter} from './alexa.router';
import {Service} from '../../util';

@Service()
export class RootRouter {

  @Use('/alexa', UseType.ROUTER)
  public alexaRouter: AlexaRouter;

  constructor(
    alexaRouter: AlexaRouter
  ) {
    this.alexaRouter = alexaRouter;
  }
}
