var Sphinx = function(api) {
  this.api = api;
};

Sphinx.prototype.start = function(callback) {
  this.api.post('start', function(json) {
    if (callback) callback();
  });
}

Sphinx.prototype.stop = function(callback) {
  this.api.post('stop', function(json) {
    if (callback) callback();
  });
}

module.exports = Sphinx;
