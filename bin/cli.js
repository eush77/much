#!/usr/bin/env node

'use strict';

var nessLess = require('..');

var output = require('simple-output')
  , concat = require('concat-stream')
  , tempfile = require('tempfile')
  , stread = require('stread');

var fs = require('fs')
  , util = require('util')
  , spawn = require('child_process').spawn;

output.stdout = output.stderr;


/**
 * "more" is a fallback that could potentially work across platforms.
 */
var defaultPager = function () {
  return process.env.PAGER || 'more';
};


/**
 * Pipe code to $PAGER.
 *
 * @arg {string} content
 * @arg {string[]} pagerArgs
 */
var pipeToPager = function (content, pagerArgs) {
  pagerArgs = pagerArgs || [];

  var pager = spawn(defaultPager(), pagerArgs, {
    stdio: ['pipe', process.stdout, process.stderr]
  });

  stread(content).pipe(pager.stdin);
};


/**
 * Open code in $PAGER, as if it was called directly with a file name.
 * Respect extension hooks (such as LESSOPEN).
 *
 * @arg {string} content
 * @arg {string[]} [pagerArgs]
 */
var openInPager = function (content, pagerArgs) {
  var tmp = tempfile('.js');

  pagerArgs = pagerArgs || [];
  pagerArgs.push(tmp);

  fs.writeFile(tmp, content, function (err) {
    if (err) throw err;

    spawn(defaultPager(), pagerArgs, {
      stdio: 'inherit'
    }).on('exit', function () {
      fs.unlink(tmp);
    });
  });
};


(function (argv) {
  var depth = 0;

  if (/^-\d+$/.test(argv[0])) {
    depth = -argv.shift();
  }

  var source, emulateDirectCall;

  if (process.stdin.isTTY) {
    var filename = argv.shift();

    if (filename == null) {
      output.error('No file to operate.');
      return;
    }
    else if (!fs.existsSync(filename)) {
      output.error('File not found: ' + filename);
      return;
    }
    else {
      source = fs.createReadStream(filename, { encoding: 'utf8' });
      emulateDirectCall = true;
    }
  }
  else {
    source = process.stdin;
    emulateDirectCall = false;
  }

  source.pipe(concat(function (code) {
    code = nessLess(code, { depth: depth });

    if (process.stdout.isTTY) {
      (emulateDirectCall ? openInPager : pipeToPager)(code, argv);
    }
    else {
      if (argv.length) {
        output.warn('Unused options: ' + JSON.stringify(argv));
      }

      util.print(code);
    }
  }));
}(process.argv.slice(2)));
