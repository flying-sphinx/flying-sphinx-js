const Action = require('./action');

class Index {
  constructor(api) {
    this.api = api;
  }

  run(indices) {
    var indices  = indices || []
    var options = {
      action: 'index',
      timeout: 10800, // 3 hours
      params: {indices: indices.join(',')}
    }

    Action.perform(this.api, options, function(output) {
      console.log(output['log']);
    });
  }
}

module.exports = Index;
