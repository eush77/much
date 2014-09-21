'use strict';

var nessLess = require('..');

var log = require('simple-output')
  , concat = require('concat-stream');

var fs = require('fs')
  , util = require('util');


(function (argv) {
  var depth = 0;

  if (/^-\d+$/.test(argv[0])) {
    depth = -argv.shift();
  }

  var source;

  if (process.stdin.isTTY) {
    var filename = argv.shift();

    if (filename == null) {
      log.error('No file to operate.');
      return;
    }
    else if (!fs.existsSync(filename)) {
      log.error('File not found: ' + filename);
      return;
    }
    else {
      source = fs.createReadStream(filename, { encoding: 'utf8' });
    }
  }
  else {
    source = process.stdin;
  }

  source.pipe(concat(function (code) {
    util.print(nessLess(code, { depth: depth }));
  }));

}(process.argv.slice(2)));
