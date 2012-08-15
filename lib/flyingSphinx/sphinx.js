var Sphinx = function(api) {
  this.api = api;
};

Sphinx.prototype.start = function() {
  this.api.post('start', function(json) {
    console.log('Sphinx started');
  });
}

Sphinx.prototype.stop = function() {
  this.api.post('stop', function(json) {
    console.log('Sphinx stopped');
  });
}

module.exports = Sphinx;
