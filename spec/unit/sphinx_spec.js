var vows         = require('vows'),
    assert       = require('assert'),
    gently       = new(require('gently'));

var Sphinx = require('../../lib/flyingSphinx/sphinx');
var api    = {};

vows.describe('Sphinx').addBatch({
  'Starting the daemon': {
    topic: new(Sphinx)(api),

    'sends a POST request to the API': function(sphinx) {
      gently.expect(api, 'post', function(path) {
        assert.equal(path, 'start');
      });

      sphinx.start();
    }
  },

  'Stopping the daemon': {
    topic: new(Sphinx)(api),

    'sends a POST request to the API': function(sphinx) {
      gently.expect(api, 'post', function(path) {
        assert.equal(path, 'stop');
      });

      sphinx.stop();
    }
  }
}).export(module);
