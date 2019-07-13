const Action = require('./action');

class Sphinx {
  constructor(api) {
    this.api = api;
  }

  start(callback) {
    Action.perform(this.api, {action: 'start'}, callback);
  }

  stop(callback) {
    Action.perform(this.api, {action: 'stop'}, callback);
  }

  restart(callback) {
    Action.perform(this.api, {action: 'restart'}, callback);
  }
}

module.exports = Sphinx;
