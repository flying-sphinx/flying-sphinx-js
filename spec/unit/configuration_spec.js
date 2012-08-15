var vows         = require('vows'),
    assert       = require('assert'),
    gently       = new(require('gently'));

global.GENTLY = gently;

var Configuration = require('../../lib/flyingSphinx/configuration');
var api           = {};

vows.describe('Configuration').addBatch({
  'uploading configuration': {
    topic: new(Configuration)(api),

    'sends a PUT request': function(configuration) {
      gently.expect(api, 'put', function(path, body) {
        assert.equal(path, '/');
        assert.equal(body.configuration, 'provided content');
      });

      configuration.upload('provided content');
    },

    'can upload directly from a file': function(configuration) {
      gently.hijacked.fs.readFileSync = function(path) {
        return 'provided content'
      }

      gently.expect(api, 'put', function(path, body) {
        assert.equal(path, '/');
        assert.equal(body.configuration, 'provided content');
      });

      configuration.upload_from_file('/path/to/file');
    }
  },

  'uploading settings': {
    topic: new(Configuration)(api),

    'sends a POST request': function(configuration) {
      gently.expect(api, 'post', function(path, body) {
        assert.equal(path, 'add_file');
        assert.deepEqual(body, {
          'setting':   'wordforms',
          'file_name': 'foo.txt',
          'content':   'contents'
        });
      });

      configuration.upload_settings('wordforms', 'foo.txt', 'contents')
    },

    'can upload directly from a file': function(configuration) {
      gently.hijacked.fs.readFileSync = function(path) { return 'contents' }

      gently.expect(api, 'post', function(path, body) {
        assert.equal(path, 'add_file');
        assert.deepEqual(body, {
          'setting':   'wordforms',
          'file_name': 'foo.txt',
          'content':   'contents'
        });
      });

      configuration.upload_settings_from_file('wordforms', '/path/to/foo.txt')
    }
  }
}).run();
