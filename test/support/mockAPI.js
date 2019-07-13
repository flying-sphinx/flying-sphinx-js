const nock = require('nock');

const defaultResponse = {status: 'OK', id: 42};

class MockAPI {
  constructor(identifier, result, server) {
    this.identifier = identifier;
    this.result = result;
    this.server = server;
  }

  register(response) {
    var response = response || defaultResponse;
    var api = this;

    this.request = nock('https://flying-sphinx.com')
      .post('/api/my/v5/perform')
      .reply(200, response);

    this.request.on('replied', function() {
      api.server.send({
        event: api.result,
        channel: api.identifier,
        data: JSON.stringify({id: 42})
      })
    });
  }
}

module.exports = MockAPI;
