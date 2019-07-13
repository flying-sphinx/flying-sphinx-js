const assert = require('assert');
const nock = require('nock');

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

var MockServer = require('./support/mockServer');
var MockAPI = require('./support/mockAPI');
var flyingSphinx = require('../lib/flyingSphinx');

var api = new flyingSphinx.API('0123456789abc', '0123456789abc');
var sphinx = new flyingSphinx.Sphinx(api);

describe('Daemon actions', function() {
  var actions = {
    starting: 'start',
    stopping: 'stop',
    restarting: 'restart'
  }

  for (var label in actions) {
    describe(label, function() {
      it('should run through on success', function(done) {
        var server = new MockServer();
        var mockAPI = new MockAPI('0123456789abc', 'completion', server);
        mockAPI.register();

        sphinx[actions[label]](function() {
          server.close(done);
        });
      });

      it('should handle failure of registering the action', function(done) {
        var server = new MockServer();
        var mockAPI = new MockAPI('0123456789abc', 'completion', server);
        mockAPI.register({status: 'FAILURE'});

        sphinx[actions[label]](function() {
          server.close(done);
        });
      });

      it('should handle failure of the action itself', function(done) {
        var server = new MockServer();
        var mockAPI = new MockAPI('0123456789abc', 'failure', server);
        mockAPI.register();

        sphinx[actions[label]](function() {
          server.close(done);
        });
      });
    });
  }
});
