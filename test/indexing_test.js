const assert = require('assert');
const nock = require('nock');

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

var MockServer = require('./support/mockServer');
var MockAPI = require('./support/mockAPI');
var flyingSphinx = require('../lib/flyingSphinx');

var api = new flyingSphinx.API('0123456789abc', '0123456789abc');
var index = new flyingSphinx.Index(api);

describe('Indexing', function() {
  describe('for all indices', function() {
    it('should run through on success', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register();

      index.run(null, function() {
        server.close(done);
      });
    });

    it('should handle failure of registering the action', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register({status: 'FAILURE'});

      index.run(null, function() {
        server.close(done);
      });
    });

    it('should handle failure of the action itself', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'failure', server);
      mockAPI.register();

      index.run(null, function() {
        server.close(done);
      });
    });
  });

  describe('for specific indices', function() {
    it('should run through on success', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register();

      index.run(["article_core"], function() {
        server.close(done);
      });
    });

    it('should handle failure of registering the action', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register({status: 'FAILURE'});

      index.run(["article_core"], function() {
        server.close(done);
      });
    });

    it('should handle failure of the action itself', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'failure', server);
      mockAPI.register();

      index.run(["article_core"], function() {
        server.close(done);
      });
    });
  });
});
