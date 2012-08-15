var vows         = require('vows'),
    assert       = require('assert'),
    gently       = new(require('gently'));

var Index = require('../../lib/flyingSphinx/index');
var api   = {};

vows.describe('Index').addBatch({
  'Processing Sphinx indices': {
    topic: new(Index)(api),

    'sends a POST request to the API': function(index) {
      gently.expect(api, 'post', function(path, body) {
        assert.equal(path, 'indices');
        assert.deepEqual(body, {'indices': ''});
      });

      index.run();
    },

    'checks the index status': function(index) {
      api.post = function(path, body, callback) {
        callback({'id': '55'});
      };

      gently.expect(api, 'get', function(path) {
        assert.equal(path, 'indices/55');
      });

      index.run();
    }
  }
}).run();
