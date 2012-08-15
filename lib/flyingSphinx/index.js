var Index = function(api) {
  this.api = api;
};

Index.prototype.run = function(indices) {
  var indices = indices || []
  var api     = this.api;

  this.api.post('indices', {'indices': indices.join(',')}, function(json) {
    var check = function(api, id, wait) {
      api.get('indices/' + id, function(json) {
        switch(json['status']) {
          case 'PENDING':
            setTimeout(function() { wait(api, id, wait); }, 3000);
            break;
          case 'FAILED':
            console.log('Index request failed');
            break;
          case 'FINISHED':
            console.log(json['log'])
            break;
          default:
            console.log('Unknown status: ' + json['status'])
        }
      });
    }
    check(api, json['id'], check);
  });
}

module.exports = Index;
