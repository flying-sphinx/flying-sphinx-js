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

  rebuild(file_path) {
    if (file_path) {
      this.process('rebuild', function(configurer) {
        configurer.addConfiguration(fs.readFileSync(file_path).toString());
      });
    } else {
      Action.perform(this.api, {action: 'rebuild'});
    }
  }

  process(action, callback) {
    var configurer = new Configurer(this.api);

    callback(configurer);

    configurer.upload(function(response) {
      if (response.status == 'OK') {
        var options = {
          action: action,
          params: {path: response.path}
        }

        Action.perform(configurer.api, options);
      } else {
        console.log('Configuration upload failed: ' + response.status)
      }
    });
  }

  upload(content) {
    this.process('configure', function(configurer) {
      configurer.addConfiguration(content);
    });
  }

  uploadFromFile(file_path) {
    this.upload(fs.readFileSync(file_path).toString());
  }

  uploadSettings(setting, file_name, content) {
    this.process('configure', function(configurer) {
      configurer.addSettingFile(setting, file_name, content);
    });
  }

  uploadSettingsFromFile(setting, file_path) {
    this.uploadSettings(setting, path.basename(file_path),
      fs.readFileSync(path));
  }
}

module.exports = Configuration;
