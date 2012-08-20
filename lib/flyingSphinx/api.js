if (global.GENTLY) require = GENTLY.hijack(require);

var API = function(identifier, api_key) {
  this.identifier = identifier || process.env.FLYING_SPHINX_IDENTIFIER;
  this.api_key    = api_key    || process.env.FLYING_SPHINX_API_KEY;

  this.version = require('../../package.json')['version']
  this.headers = {
    'Accept':                  'application/vnd.flying-sphinx-v3+json',
    'X-Flying-Sphinx-Token':   this.identifier + ':' + this.api_key,
    'X-Flying-Sphinx-Version': this.version + '+js'
  };

  this.request = require('request');
}

API.prototype.get = function(path, body, callback) {
  this.send(this.request.get, path, 'qs', body, callback);
}

API.prototype.post = function(path, body, callback) {
  this.send(this.request.post, path, 'form', body, callback);
}

API.prototype.put = function(path, body, callback) {
  this.send(this.request.put, path, 'form', body, callback);
}

API.prototype.send = function(http_method, path, data_key, body, callback) {
  body     = body     || {};
  callback = callback || function() {};

  if (typeof body == 'function') {
    callback = body;
    body     = {};
  }

  if (path == '/' || path == '') {
    path = ''
  } else {
    path = "/" + path.replace(/^\//, '')
  }

  options = {
    uri:     "https://flying-sphinx.com/api/my/app" + path,
    headers: this.headers
  }
  options[data_key] = body

  http_method(options, function(error, response, body) {
    if (process.env.VERBOSE_LOGGING) {
      console.log(response.request.uri.href);
      console.log(response.headers);
      console.log(response.body);
    }
    callback(JSON.parse(body))
  });
}

module.exports = API;
