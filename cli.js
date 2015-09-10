#!/usr/bin/env node
'use strict';

var ContentBox = require('./lib/widgets/content-box'),
    Input = require('./lib/widgets/input'),
    error = require('./lib/error'),
    enableSearch = require('./lib/search'),
    enableEscapeLock = require('./lib/escape-lock');

var blessed = require('blessed'),
    help = require('help-version')(usage()).help,
    concat = require('concat-stream'),
    ttys = require('ttys');

var fs = require('fs');


function usage () {
  return 'Usage:  much [<file>]';
}


(function main (argv) {
  if (argv.length > 1) {
    return help(1);
  }

  var filename = argv[0] || '-';

  (filename == '-' ? process.stdin : fs.createReadStream(filename))
    .on('error', error)
    .pipe(concat({ encoding: 'string' }, function (content) {
      Screen({
        title: 'much ' + filename,
        content: content
      }).render();
    }));
}(process.argv.slice(2)));


function Screen (opts) {
  var screen = blessed.screen({
    title: opts.title,
    input: ttys.stdin,
    smartCSR: true
  });

  // We don't use screen.$, screen._ and screen.data interchangeably.
  //
  // - screen.$ gives access to widgets by unique ids.
  // - screen._ contains useful helper functions.
  // - screen.data represents (hopefully modest) global application state.
  //

  var $ = screen.$ = {
    contentBox: ContentBox(screen, opts.content),
    input: Input(screen, {
      height: 1,
      bottom: 0,
      hidden: true
    })
  };

  screen.append($.contentBox);
  screen.append($.input);

  screen._ = {
    showInput: function () {
      $.contentBox.bottom = 1;
      $.input.show();
    },
    hideInput: function () {
      $.contentBox.bottom = 0;
      $.input.hide();
    }
  };

  screen.data = {
    escapeLock: false  // Whether escape key is pressed.
  };

  enableEscapeLock(screen);
  enableSearch(screen);
  setupControls(screen);
  return screen;
}


function setupControls (screen) {
  screen.key(['q', 'C-c'], function () {
    process.exit();
  });

  screen.key('C-z', function () {
    screen.leave();
    process.kill(process.pid, 'SIGSTOP');
  });

  process.on('SIGCONT', function () {
    screen.enter();
    screen.render();
  });
}
