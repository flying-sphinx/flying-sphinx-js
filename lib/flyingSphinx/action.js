const PusherClient = require('./websocket');
const PusherKey = 'a8518107ea8a18fe5559';

class Action {
  static perform(api, options, callback) {
    new Action(api.identifier, options.timeout, function(postRegistration) {
      api.call_action(options.action, options.params, function(response) {
        postRegistration(response);
      });
    }).perform(callback);
  }

  constructor(identifier, timeout, behaviour) {
    this.identifier = identifier;
    this.timeout = timeout || 60; // in seconds
    this.behaviour = behaviour;

    this.client = new PusherClient({key: PusherKey});
  }

  perform(callback) {
    var action = this;

    this.timer = setTimeout(function() {
      action.finish(
        "Action timed out after " + action.timeout + " seconds.",
        {log: "Action timed out after " + action.timeout + " seconds."},
        callback
      );
    }, this.timeout * 1000);

    this.client.on('connect', function() {
      var channel = action.client.subscribe(action.identifier);

      channel.on('success', function() {
        channel.on('completion', function(data) {
          if (data['id'] == action.actionId) {
            action.finish('Action finished.', data, callback);
          }
        });

        channel.on('debug', function(data) {
          if (data['data'].length > 0) {
            console.log(json['data']);
          }
        });

        channel.on('failure', function(data) {
          if (data['id'] == action.actionId) {
            action.finish('Action failed.', data, callback);
          }
        });

        action.behaviour(function(response) {
          if (response['status'] != 'OK') {
            action.finish(
              "Unable to perform action.",
              {log: "Reason given: " + response['status']},
              callback
            );
          }
          // TODO: Retry behaviour call up to three times.

          action.actionId = response['id'];
        });
      });
    });

    this.client.connect();
  }

  finish(message, data, callback) {
    clearTimeout(this.timer);

    console.log(message);
    this.client.disconnect();

    if (callback) { callback(data); }
  }
}

module.exports = Action;
