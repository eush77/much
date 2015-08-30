#!/usr/bin/env node
'use strict';

var fold = require('./lib/fold'),
    lesspipe = require('./lib/lesspipe');

var blessed = require('blessed'),
    help = require('help-version')(usage()).help,
    concat = require('concat-stream'),
    ttys = require('ttys');

var fs = require('fs');


function usage () {
  return 'Usage:  much [<file>]';
}


function error (err) {
  console.error(err.toString());
  process.exit(2);
}


(function main (argv) {
  if (argv.length > 1) {
    return help(1);
  }

  var filename = argv[0] || '-';

  (filename == '-' ? process.stdin : fs.createReadStream(filename))
    .on('error', error)
    .pipe(concat({ encoding: 'string' }, render));

  function render (content) {
    var screen = Screen('much ' + filename);
    var contentBox = ContentBox(content);
    screen.append(contentBox);
    screen.render();
  }
}(process.argv.slice(2)));


function Screen (title) {
  var screen = blessed.screen({
    title: title,
    input: ttys.stdin,
    smartCSR: true
  });

  screen.key(['q', 'C-c'], function () {
    process.exit();
  });

  return screen;
}


function ContentBox (content) {
  var box = blessed.scrollablebox({
    border: {
      type: 'line'
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: true,
    keys: true,
    vi: true,
    style: {
      scrollbar: {
        bg: 'red'
      }
    }
  });

  var depth = 2;
  render(depth);

  box.key(['left', 'h'], function () {
    render(depth = Math.max(0, depth - 1));
  });

  box.key(['right', 'l'], function () {
    render(++depth);
  });

  function render (depth) {
    lesspipe(fold(content, { depth: depth }), function (err, content) {
      if (err) return error(err);
      box.content = content;
      box.screen.render();
    });
  }

  return box;
}
