import * as express from 'express';

import {Service} from '../util';
import {Post} from '../util/routers/methods.decorator';
import {Response} from '../util/routers/response';
import {BodyParsed} from '../util/routers/body-parsed.decorator';

@Service()
export class AlexaRouter {

  private itemStates: any = {};

  @Post('/')
  @BodyParsed()
  public postRequest(req: express.Request, res: express.Response): void {
    console.log('Alexa\n======');
    console.log(req.method);
    console.log('======');
    Object.keys(req.headers).forEach(header => console.log(`${header} : ${req.headers[header]}`));
    console.log('======');
    console.log(req.body);

    if (req.body && req.body.request && req.body.request.type === 'IntentRequest' && req.body.request.intent) {
      const intent = req.body.request.intent;

      const slots = intent.slots;
      const item = slots.item && slots.item.value || 'thing';

      let output: Alexa.Speech;

      switch(intent.name) {
        case 'GetThingState':
          output = {
            type: 'PlainText',
            text: 'Currently ' + (this.itemStates[item] ? 'on' : 'off')
          };
          break;
        case 'TurnThingOn':
          output = {
            type: 'PlainText',
            text: ''
          };
          if (this.itemStates[item]) {
            output.text =`That was already on`;
          } else {
            this.itemStates[item] = true;
            output.text = `OK, I've turned the ${item} on`;
          }
          break;
        case 'TurnThingOff':
          output = {
            type: 'PlainText',
            text: ''
          };
          if (!this.itemStates[item]) {
            output.text = `That was already off`;
          } else {
            this.itemStates[item] = undefined;
            output.text = `OK, I've turned the ${item} off`;
          }
          break;
        default:
          console.error('Unknown intent:', intent);
          output = {
            type: 'PlainText',
            text: 'I did not understand that, you muppet.'
          };
      }

      const response = {
        version: '1.0',
        response: {
          outputSpeech: output
        }
      };

      console.log('Response', response);

      res.json(response).end();

    } else {
      res.status(400).end();
    }
  }
}
