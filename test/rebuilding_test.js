const assert = require('assert');
const nock = require('nock');

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

var MockServer = require('./support/mockServer');
var MockAPI = require('./support/mockAPI');
var flyingSphinx = require('../lib/flyingSphinx');

var api = new flyingSphinx.API('0123456789abc', '0123456789abc');
var configuration = new flyingSphinx.Configuration(api);

describe('Rebuilding', function() {
  describe('with a Sphinx file', function() {
    it('should run through on success', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register();

      nock('https://flying-sphinx.com')
        .get('/api/my/v5/presignature')
        .reply(200, {
          url: 'https://aws.amazon.com',
          path: '/foo/bar.tar.gz',
          fields: {},
          status: 'OK'
        });

      nock('https://aws.amazon.com').post('/').reply(200, {});

      configuration.rebuild('indexer { }', function() {
        server.close(done);
      });
    });

    it('should handle failure to request a pre-signature', function(done) {
      var server = new MockServer();

      nock('https://flying-sphinx.com')
        .get('/api/my/v5/presignature')
        .reply(200, {
          status: 'FAILURE'
        });

      configuration.rebuild('indexer { }', function() {
        server.close(done);
      });
    });

    it('should handle failure to upload configuration', function(done) {
      var server = new MockServer();

      nock('https://flying-sphinx.com')
        .get('/api/my/v5/presignature')
        .reply(200, {
          url: 'https://aws.amazon.com',
          path: '/foo/bar.tar.gz',
          fields: {},
          status: 'OK'
        });

      nock('https://aws.amazon.com').post('/').reply(400, {});

      configuration.rebuild('indexer { }', function() {
        server.close(done);
      });
    });

    it('should handle failure of registering the action', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register({status: 'FAILURE'});

      nock('https://flying-sphinx.com')
        .get('/api/my/v5/presignature')
        .reply(200, {
          url: 'https://aws.amazon.com',
          path: '/foo/bar.tar.gz',
          fields: {},
          status: 'OK'
        });

      nock('https://aws.amazon.com').post('/').reply(200, {});

      configuration.rebuild('indexer { }', function() {
        server.close(done);
      });
    });

    it('should handle failure of the action itself', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'failure', server);
      mockAPI.register();

      nock('https://flying-sphinx.com')
        .get('/api/my/v5/presignature')
        .reply(200, {
          url: 'https://aws.amazon.com',
          path: '/foo/bar.tar.gz',
          fields: {},
          status: 'OK'
        });

      nock('https://aws.amazon.com').post('/').reply(200, {});

      configuration.rebuild('indexer { }', function() {
        server.close(done);
      });
    });
  });

  describe('with no sphinx file', function() {
    it('should run through on success', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register();

      configuration.rebuild(null, function() {
        server.close(done);
      });
    });

    it('should handle failure of registering the action', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'completion', server);
      mockAPI.register({status: 'FAILURE'});

      configuration.rebuild(null, function() {
        server.close(done);
      });
    });

    it('should handle failure of the action itself', function(done) {
      var server = new MockServer();
      var mockAPI = new MockAPI('0123456789abc', 'failure', server);
      mockAPI.register();

      configuration.rebuild(null, function() {
        server.close(done);
      });
    });
  });
});
