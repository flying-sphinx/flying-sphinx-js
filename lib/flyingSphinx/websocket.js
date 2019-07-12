const WebSocket = require('ws');
const EventEmitter = require('events');

class PusherChannel extends EventEmitter {
  constructor(channel_name) {
    super();

    this.channel_name = channel_name;
  }
}

class PusherClient extends EventEmitter {
  constructor(credentials) {
    super();

    this.credentials = credentials;
    this.channels = {};
  }

  subscribe(channel_name) {
    var request = {
      event: 'pusher:subscribe',
      data: {channel: channel_name}
    }

    this.log("Subscribing to " + channel_name);
    this.log(request);
    this.client.send(JSON.stringify(request));

    var channel = this.channels[channel_name];
    if (channel) {
      new Error("Existing subscription to #{channel_name}");
    } else {
      channel = new PusherChannel(channel_name);
      this.channels[channel_name] = channel;
    }

    return channel;
  }

  connect() {
    this.client = new WebSocket(
      "wss://ws.pusherapp.com:443/app/" +
      this.credentials.key +
      "?client=flying-sphinx-js&version=0.0.1&protocol=5&flash=false"
    )

    var socket = this;

    this.client.on('open', function() {
      socket.log('connected to pusher');
    });

    this.client.on('message', function(message) {
      socket.receiveMessage(message);
    });
  }

  disconnect() {
    if (this.client.readyState > 0) {
      this.client.close();
    }
  }

  log(message) {
    if (process.env.VERBOSE_LOGGING) {
      console.log(message);
    }
  }

  receiveMessage(message) {
    this.log('message received: ' + message);

    var payload = JSON.parse(message);

    switch(payload.event) {
      case 'pusher:connection_established':
        this.emit('connect');
        break;
      case 'pusher_internal:subscription_succeeded':
        var channel = this.channels[payload.channel];
        if (channel) { channel.emit('success'); }
        break;
      case 'pusher:error':
        this.log(payload);
        break;
    }

    channel = this.channels[payload.channel];
    if (channel) { channel.emit(payload.event, JSON.parse(payload.data)); }
  }
}

module.exports = PusherClient
