var nodeFetch = require('node-fetch');
var querystring = require('querystring');

var REMOTE_CLOUD_URL = 'https://home.paullessing.com/api/alexa/home';

/**
 * Main entry point.
 * Incoming events from Alexa Lighting APIs are processed via this method.
 */
function entryPoint(event, context) {

  log('Input', event);

  switch (event.header.namespace) {

    case 'Alexa.ConnectedHome.Discovery':
      handleDiscovery(event, context);
      break;

    case 'Alexa.ConnectedHome.Control':
      handleControl(event, context);
      break;

    default:
      log('Err', 'No supported namespace: ' + event.header.namespace);
      context.fail('Something went wrong');
      break;
  }
}

function handleDiscovery(event, context) {
  log('Event', event);

  var data = JSON.stringify(event);

  nodeFetch(REMOTE_CLOUD_URL + '/discovery', {
    method: 'POST',
    body: data,
    headers: {'Content-Type': 'application/json' },
    timeout: 2000
  })
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      log('Fetch result', json);
      context.succeed(json);
    }).catch(function(err) {
      log('NATASHA could not connect', err);
      context.succeed({
        header: {
          messageId: '0',
          name: 'DiscoverAppliancesResponse',
          namespace: 'Alexa.ConnectedHome.Discovery',
          payloadVersion: '2'
        },
        payload: {
          discoveredAppliances: []
        }
      });
    });
}

/**
 * Control events are processed here.
 * This is called when Alexa requests an action (IE turn off appliance).
 */
function handleControl(event, context) {

  /**
   * Fail the invocation if the header is unexpected. This example only demonstrates
   * turn on / turn off, hence we are filtering on anything that is not SwitchOnOffRequest.
   */
  if (event.header.namespace !== 'Control' || event.header.name !== 'SwitchOnOffRequest') {
    context.fail(generateControlError('SwitchOnOffRequest', 'UNSUPPORTED_OPERATION', 'Unrecognized operation'));
  }

  if (event.header.namespace === 'Control' && event.header.name === 'SwitchOnOffRequest') {

    /**
     * Retrieve the appliance id and accessToken from the incoming message.
     */
    var applianceId = event.payload.appliance.applianceId;
    var accessToken = event.payload.accessToken.trim();
    log('applianceId', applianceId);

    /**
     * Make a remote call to execute the action based on accessToken and the applianceId and the switchControlAction
     * Some other examples of checks:
     *	validate the appliance is actually reachable else return TARGET_OFFLINE error
     *	validate the authentication has not expired else return EXPIRED_ACCESS_TOKEN error
     * Please see the technical documentation for detailed list of errors
     */
    var basePath = '';
    if (event.payload.switchControlAction === 'TURN_ON') {
      basePath = REMOTE_CLOUD_BASE_PATH + '/' + applianceId + '/on?access_token=' + accessToken;
    } else if (event.payload.switchControlAction === 'TURN_OFF') {
      basePath = REMOTE_CLOUD_BASE_PATH + '/' + applianceId + '/off?access_token=' + accessToken;
    }

    var options = {
      hostname: REMOTE_CLOUD_HOSTNAME,
      port: 80,
      path: basePath,
      headers: {
        accept: '*/*'
      }
    };

    var serverError = function (e) {
      log('Error', e.message);
      /**
       * Craft an error response back to Alexa Smart Home Skill
       */
      context.fail(generateControlError('SwitchOnOffRequest', 'DEPENDENT_SERVICE_UNAVAILABLE', 'Unable to connect to server'));
    };

    var callback = function(response) {
      var str = '';

      response.on('data', function(chunk) {
        str += chunk.toString('utf-8');
      });

      response.on('end', function() {
        /**
         * Test the response from remote endpoint (not shown) and craft a response message
         * back to Alexa Smart Home Skill
         */
        log('done with result');
        var headers = {
          namespace: 'Control',
          name: 'SwitchOnOffResponse',
          payloadVersion: '1'
        };
        var payloads = {
          success: true
        };
        var result = {
          header: headers,
          payload: payloads
        };
        log('Done with result', result);
        context.succeed(result);
      });

      response.on('error', serverError);
    };

    /**
     * Make an HTTPS call to remote endpoint.
     */
    http.get(options, callback)
      .on('error', serverError).end();
  }
}

/**
 * Utility functions.
 */
function log(title, msg) {
  console.log('*************** ' + title + ' *************');
  console.log(msg);
  console.log('*************** ' + title + ' End*************');
}

function generateControlError(name, code, description) {
  var headers = {
    namespace: 'Control',
    name: name,
    payloadVersion: '1'
  };

  var payload = {
    exception: {
      code: code,
      description: description
    }
  };

  var result = {
    header: headers,
    payload: payload
  };

  return result;
}

exports.handler = entryPoint;
