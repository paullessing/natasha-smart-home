import {Service, Use, UseType} from '../util';
import {AlexaRouter} from './alexa.router';

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
