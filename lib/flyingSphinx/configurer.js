const request = require('request');
const archiver = require('archiver');
const zlib = require('zlib');
const path = require('path');

class Configurer {
  constructor(api) {
    this.api  = api;
    this.gzip = zlib.createGzip();
    this.archive = archiver('tar', {
      zlib: { level: 9 } // Sets the compression level.
    });
    this.extras = [];

    this.archive.pipe(this.gzip);
  }

  addConfiguration(raw) {
    this.archive.append(raw, {name: 'sphinx/raw.conf'});
  }

  addEngine(engine) {
    this.archive.append(engine, {name: 'sphinx/engine.txt'});
  }

  addSettingFile(setting, file_path, content) {
    var key = setting + '/' + path.basename(file_path);

    this.extras.push(key);
    this.archive.append(content, {name: key});
  }

  addVersion(version) {
    this.archive.append(version, {name: 'sphinx/version.txt'});
  }

  upload(callback) {
    this.archive.append(this.extras.join(";"), {name: 'sphinx/extra.txt'});
    this.archive.finalize();

    var configurer = this;

    this.api.get('/presignature', {}, function(presignature) {
      if (presignature.status != 'OK') {
        callback({status: presignature.status});
        return;
      }

      presignature.fields['file'] = configurer.gzip.read();

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
