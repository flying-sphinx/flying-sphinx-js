if (global.GENTLY) require = GENTLY.hijack(require);

var Configuration = function(api) {
  this.api  = api;
  this.fs   = require('fs');
  this.path = require('path');
};

Configuration.prototype = {
  upload: function(content) {
    this.api.put('/', {'configuration': content}, function(json) {
      console.log('Sphinx configuration updated');
    });
  },

  uploadFromFile: function(path) {
    this.upload(this.fs.readFileSync(path).toString());
  },

  uploadSettings: function(setting, file_name, content) {
    this.api.post('add_file', {
      'setting':   setting,
      'file_name': file_name,
      'content':   content
    }, function(json) { console.log('Uploaded ' + file_name + ' content')});
  },

  uploadSettingsFromFile: function(setting, path) {
    this.uploadSettings(setting, this.path.basename(path),
      this.fs.readFileSync(path));
  }
}

module.exports = Configuration;
