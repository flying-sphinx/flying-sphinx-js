const Action = require('./action');

class Index {
  constructor(api) {
    this.api = api;
  }

  run(indices, callback) {
    var indices  = indices || []
    var options = {
      action: 'index',
      timeout: 10800, // 3 hours
      params: {indices: indices.join(',')}
    }

    Action.perform(this.api, options, function(output) {
      console.log(output['log']);

      if (callback) { callback(); }
    });
  }
}

module.exports = Index;
