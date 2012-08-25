var vows         = require('vows'),
    assert       = require('assert'),
    gently       = new(require('gently'));

global.GENTLY = gently;

var version = require('../../package.json')['version'];
var API     = require('../../lib/flyingSphinx/api');

vows.describe('API').addBatch({
  'GET request': {
    topic: new(API)('abc', '123'),

    'sends a GET request': function(api) {
      gently.expect(gently.hijacked.request, 'get', function(options) {
        assert.equal(options.uri, 'https://flying-sphinx.com/api/my/app');

        assert.deepEqual(options.qs,      {'id': '55'})
        assert.deepEqual(options.headers, {
          'Accept':                  'application/vnd.flying-sphinx-v3+json',
          'X-Flying-Sphinx-Token':   'abc:123',
          'X-Flying-Sphinx-Version': version + '+js'
        });
      });

      api.get('', {'id': '55'});
    },

    'returns the request body': function(api) {
      gently.hijacked.request.get = function(options, callback) {
        callback({}, {}, '{"JSON": "body"}');
      }

      api.get('', {'id': '55'}, function(json) {
        assert.deepEqual(json, {'JSON': 'body'})
      });
    },

    'it does not require query parameters': function(api) {
      gently.hijacked.request.get = function(options, callback) {
        callback({}, {}, '{"JSON": "body"}');
      }

      var result = {callback: function(json) {}}
      gently.expect(result, 'callback', function() {})

      api.get('', result.callback);
    }
  },

  'POST request': {
    topic: new(API)('abc', '123'),

    'sends a POST request': function(api) {
      gently.expect(gently.hijacked.request, 'post', function(options) {
        assert.equal(options.uri, 'https://flying-sphinx.com/api/my/app');

        assert.deepEqual(options.form,    {'id': '55'})
        assert.deepEqual(options.headers, {
          'Accept':                  'application/vnd.flying-sphinx-v3+json',
          'X-Flying-Sphinx-Token':   'abc:123',
          'X-Flying-Sphinx-Version': version + '+js'
        });
      });

      api.post('', {'id': '55'});
    },

    'returns the request body': function(api) {
      gently.hijacked.request.post = function(options, callback) {
        callback({}, {}, '{"JSON": "body"}');
      }

      api.post('', {'id': '55'}, function(json) {
        assert.deepEqual(json, {'JSON': 'body'})
      });
    }
  },

  'PUT request': {
    topic: new(API)('abc', '123'),

    'sends a PUT request': function(api) {
      gently.expect(gently.hijacked.request, 'put', function(options) {
        assert.equal(options.uri, 'https://flying-sphinx.com/api/my/app');

        assert.deepEqual(options.form,    {'id': '55'})
        assert.deepEqual(options.headers, {
          'Accept':                  'application/vnd.flying-sphinx-v3+json',
          'X-Flying-Sphinx-Token':   'abc:123',
          'X-Flying-Sphinx-Version': version + '+js'
        });
      });

      api.put('', {'id': '55'});
    },

    'returns the request body': function(api) {
      gently.hijacked.request.put = function(options, callback) {
        callback({}, {}, '{"JSON": "body"}');
      }

      api.put('', {'id': '55'}, function(json) {
        assert.deepEqual(json, {'JSON': 'body'})
      });
    }
  }
}).export(module);
