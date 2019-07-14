# Flying Sphinx Client for Node.js

[![Build Status](https://travis-ci.org/flying-sphinx/flying-sphinx-js.svg?branch=master)](https://travis-ci.org/flying-sphinx/flying-sphinx-js)

This is a Node.js client for [flying-sphinx.com](https://flying-sphinx.com).

Please note that this is not a client for Sphinx itself. Check out [sphinxapi](https://github.com/lindory-project/node-sphinxapi) or [limestone](https://github.com/kurokikaze/limestone) for talking to Sphinx itself.

## Installation

The `flying-sphinx` package is available via npm:

```
npm install flying-sphinx
```

## Usage

If you're not familiar with Sphinx, then this isn't the place to start... but once you understand how Sphinx works, there's a few key areas to interact with Flying Sphinx: configuration of Sphinx, processing the indices, and starting up and stopping the daemon.

Authentication credentials are sourced from the environment (`FLYING_SPHINX_IDENTIFIER` and `FLYING_SPHINX_API_KEY`) - and these are automatically available through Heroku. If for some reason you wish to run commands locally, then you'll need to make sure those two settings are in place.

### Configuration

To get your Sphinx configuration file loaded, you'll need send the file through to Flying Sphinx. This can be done from the command line via Heroku:

```
$ heroku run flying-sphinx configure /path/to/sphinx.conf
```

If you have additional configuration files (such as wordforms, stopwords or exceptions), want to set a specific version/engine of Sphinx, or want to generate your configuration file dynamically, then you can use the following commands through Javascript:

```js
var flyingSphinx = require('flyingSphinx');
var configuration = flyingSphinx.configuration();

// first argument can one of two options:
// * 'configure' - updates the configuration only.
// * 'rebuild'   - stops the daemon, updates the configuration, re-indexes, and
//                 starts the daemon up again.
configuration.process('configure', function(configurer) {
  // Upload Sphinx configuration
  configurer.addConfiguration('indexer { }');

  // Can be 'sphinx' or 'manticore'
  configurer.addEngine('sphinx');

  // For Sphinx, you should use 2.2.11 or newer.
  // For Manticore, you should use 2.7.5 or newer.
  // The supported versions are listed here:
  // http://support.flying-sphinx.com/kb/configuration/setting-your-sphinx-version
  configurer.addVersion('2.2.11')

  // For setting files, specify the setting, the name of the file, and
  // the contents of the file.
  configurer.addSettingFile('wordforms', 'wordforms.txt', 'file contents');
});
```

Make sure any settings file names match what you've set in your configuration file, but don't stress about paths - Flying Sphinx will set them up for you. Settings files must be unique per setting - if you refer to @a.txt@ for wordforms in more than one place, it'll be a single file, not scoped to index.

### Processing Indices

Now that Flying Sphinx is aware of your Sphinx configuration, you'll want to get Sphinx processing your data. This can be done over the command line as well:

```
$ heroku run flying-sphinx index
```

If you want to process specific indices, just specify them as arguments:

```
$ heroku run flying-sphinx index article user
```

This can also be done through code if necessary:

```js
var flyingSphinx = require('flyingSphinx');
flyingSphinx.index().run();
```

`run` can take two arguments, the first being an array of index names, the second being a callback function to run with the resulting log. They're both optional, but if you just want a callback, specify an empty array for the first argument.

### Controlling the Daemon

Again, easy via either the command line or through code:

```
$ heroku run flying-sphinx start
$ heroku run flying-sphinx stop
```

```js
var flyingSphinx = require('flyingSphinx');
flyingSphinx.sphinx().start();
flyingSphinx.sphinx().stop();
flyingSphinx.sphinx().restart();
```

Both of the javascript methods are asynchronous and can take an optional callback function as an argument.

### Convenience Commands

Via the command line, you can also use the `restart` command (to stop and then start the Sphinx daemon) and the `rebuild` command (to stop the daemon, process indices, then start the daemon back up).

```
$ heroku run flying-sphinx restart
$ heroku run flying-sphinx rebuild
```

You can also supply a file path to a configuration file for the rebuild argument:

```
$ heroku run flying-sphinx rebuild /path/to/sphinx.conf
```

## Compatibility and Limitations

This library is currently built and tested against Node v8/v10/v11/v12. If you are using an older version of Node, please use the v0.2.3 release of this library.

## Contributing

Patches are indeed welcome. The flying-sphinx.com API documentation will be provided at some point in the future, but generally keep in mind the following:

* The environment is managed via npm.
* Please use the test frameworks as shown by the existing tests - and do write tests.
* Keep your commits in a separate branch.
* Don't mess around with the version number in your branch - this keeps merges easier for me to manage.

## Licence

Copyright &copy; 2012-2019 Pat Allan, released under an MIT licence.
