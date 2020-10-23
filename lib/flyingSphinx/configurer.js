const request = require('request');
const compressing = require('compressing');
const path = require('path');
const buffer = require('buffer');

class Configurer {
  constructor(api) {
    this.api  = api;
    this.archive = new compressing.tgz.Stream();
    this.extras = [];
  }

  addConfiguration(raw) {
    this.addFile(raw, 'sphinx/raw.conf');
  }

  addEngine(engine) {
    this.addFile(engine, 'sphinx/engine.txt');
  }

  addSettingFile(setting, file_path, content) {
    var key = setting + '/' + path.basename(file_path);

    this.extras.push(key);
    this.addFile(content, key);
  }

  addVersion(version) {
    this.addFile(version, 'sphinx/version.txt');
  }

  addFile(contents, name) {
    this.archive.addEntry(Buffer.from(contents), {relativePath: name});
  }

  upload(callback) {
    this.addFile(this.extras.join(';'), 'sphinx/extra.txt');

    var output = this.archive;

    this.api.get('/presignature', {}, function(presignature) {
      if (presignature.status != 'OK') {
        callback({status: presignature.status});
        return;
      }

      presignature.fields['file'] = output.read();

      request.post({url: presignature.url, formData: presignature.fields}, function(err, response, body) {
        if (response.statusCode == 200) {
          callback({status: 'OK', path: presignature.path});
        } else {
          callback({status: 'ERROR'});
        }
      });
    });
  }
}

module.exports = Configurer;
