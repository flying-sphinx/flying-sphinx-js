if (global.GENTLY) require = GENTLY.hijack(require);

const querystring = require('querystring');
const request = require('request');
const crypto = require('crypto');

class API {
  constructor(identifier, api_key) {
    this.identifier = identifier || process.env.FLYING_SPHINX_IDENTIFIER;
    this.api_key    = api_key    || process.env.FLYING_SPHINX_API_KEY;
  }

  call_action(action, params, callback) {
    params = params || {};
    params['action'] = action;

    this.post('perform', params, callback);
  }

  get(path, body, callback) {
    this.send('get', path, body, callback);
  }

  post(path, body, callback) {
    this.send('post', path, body, callback);
  }

  send(http_method, path, body, callback) {
    body     = body     || {};
    callback = callback || function() {};

    var apiRequest = new ApiRequest(http_method, path, body);
    apiRequest.sign(this.identifier, this.api_key);

    request[http_method](apiRequest.toOptions(), this.receive(callback));
  }

  receive(callback) {
    return function(error, response, body) {
      if (process.env.VERBOSE_LOGGING) {
        console.log(response.request.uri.href);
        console.log(response.headers);
        console.log(body);
        console.log(response.statusCode);
      }

      callback(JSON.parse(body));
    };
  }
}

class ApiRequest {
  constructor(http_method, path, body) {
    this.http_method = http_method;
    this.path = '/api/my/v5' + this.normalisePath(path);
    this.body = body;
    this.headers = this.default_headers();

    if (http_method != 'get') {
      this.body = querystring.stringify(body);
    }

    this.headers['Content-Digest'] = this.digest();
    this.headers['Date'] = new Date().toUTCString();
  }

  default_headers() {
    var version = require('../../package.json')['version'];

    return {
      'Content-Type':            'application/x-www-form-urlencoded',
      'X-Flying-Sphinx-Version': version + '+js'
    };
  }

  digest() {
    if (this.http_method != 'post') { return ''; }

    crypto.createHash('md5').update(this.body).digest('hex');
  }

  normalisePath(path) {
    if (path == '/' || path == '') {
      return '';
    }

    return "/" + path.replace(/^\//, '');
  }

  sign(identifier, api_key) {
    var signature = crypto.createHmac('sha256', api_key).update(this.signaturePayload()).digest('base64');

    this.headers['Authorization'] = 'Thebes ' + identifier + ':' + signature;
  }

  signaturePayload() {
    return [
      this.http_method.toUpperCase(),
      this.headers['Content-Type'],
      this.headers['Content-Digest'],
      this.headers['Date'],
      this.path
    ].join("\n");
  }

  toOptions() {
    var dataKey = (this.http_method == 'get' ? 'qs' : 'body');
    var options = {
      uri:     'https://flying-sphinx.com' + this.path,
      headers: this.headers
    }

    options[dataKey] = this.body

    return options;
  }
}

module.exports = API;
