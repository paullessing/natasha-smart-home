import {UseType, Use} from 'express-router-decorators';

import {Service} from '../../util';
import {AlexaHomeSkillRouter} from './alexa-home.router';
import {AlexaCustomSkillRouter} from './alexa-custom.router';

@Service()
export class AlexaRouter {

  @Use('/home', UseType.ROUTER)
  public homeRouter: AlexaHomeSkillRouter;

  @Use('/home', UseType.ROUTER)
  public customRouter: AlexaCustomSkillRouter;

  constructor(
    homeRouter: AlexaHomeSkillRouter,
    customRouter: AlexaCustomSkillRouter
  ) {
    this.homeRouter = homeRouter;
    this.customRouter = customRouter;
  }
}
