const WebSocket = require('ws');

process.env.FLYING_SPHINX_WEBSOCKET_URL = 'ws://127.0.0.1:8080'

class MockServer {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.client = null;

    var server = this;

    this.wss.on('connection', function(ws) {
      server.client = ws;
      server.accept(ws);
    });
  }

  accept(ws) {
    var server = this;

    ws.on('message', function(message) {
      var payload = JSON.parse(message);
      switch(payload.event) {
        case 'pusher:subscribe':
          server.send({
            event: 'pusher_internal:subscription_succeeded',
            channel: payload.data.channel,
            data: JSON.stringify({})
          });
          break;
      }
    });

    server.send({event: 'pusher:connection_established'});
  }

  send(message) {
    this.client.send(JSON.stringify(message));
  }

  close(callback) {
    this.wss.close(callback);
  }
}

module.exports = MockServer;
