if (global.GENTLY) require = GENTLY.hijack(require);

const fs = require('fs');
const path = require('path');
const request = require('request');

const Action = require('./action');
const Configurer = require('./configurer');

class Configuration {
  constructor(api) {
    this.api  = api;
  }

  rebuild(content, callback) {
    if (content) {
      this.process('rebuild', function(configurer) {
        configurer.addConfiguration(content);
      }, callback);
    } else {
      Action.perform(this.api, {action: 'rebuild', timeout: 10800}, callback);
    }
  }

  rebuildFromFile(file_path, callback) {
    if (file_path) {
      this.rebuild(fs.readFileSync(file_path).toString(), callback);
    } else {
      this.rebuild(null, callback);
    }
  }

  process(action, configure, callback) {
    var configurer = new Configurer(this.api);

    configure(configurer);

    configurer.upload(function(response) {
      if (response.status == 'OK') {
        var options = {
          action: action,
          params: {path: response.path}
        }
        if (action == 'rebuild') { options.timeout = 10800; }

        Action.perform(configurer.api, options, callback);
      } else {
        console.log('Configuration upload failed: ' + response.status);
        callback({log: ''});
      }
    });
  }

  upload(content, callback) {
    this.process('configure', function(configurer) {
      configurer.addConfiguration(content);
    }, callback);
  }

  uploadFromFile(file_path, callback) {
    this.upload(fs.readFileSync(file_path).toString(), callback);
  }

  uploadSettings(setting, file_name, content, callback) {
    this.process('configure', function(configurer) {
      configurer.addSettingFile(setting, file_name, content);
    }, callback);
  }

  uploadSettingsFromFile(setting, file_path, callback) {
    this.uploadSettings(setting, path.basename(file_path),
      fs.readFileSync(path), callback);
  }
}

module.exports = Configuration;
