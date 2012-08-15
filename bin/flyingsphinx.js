#!/usr/bin/env node
var flyingSphinx = require('../lib/flyingSphinx');

flyingSphinx.cli(process.argv[2], process.argv.slice(3));
