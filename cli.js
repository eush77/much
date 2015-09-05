#!/usr/bin/env node
'use strict';

var Foldable = require('./lib/fold'),
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
  blessed.screen.instances[0].destroy();
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

  var contentBox = ContentBox(opts.content);

  screen.key(['q', 'C-c'], function () {
    process.exit();
  });

  screen.append(contentBox);
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

  var foldable = Foldable(content);
  var depth = 0;
  var maxDepth = foldable.maxDepth();

  render(depth);

  box.key(['left', 'h'], function () {
    render(depth = Math.max(0, depth - 1));
  });

  box.key(['S-left', 'S-h'], function () {
    render(depth = 0);
  });

  box.key(['right', 'l'], function () {
    render(depth = Math.min(maxDepth, depth + 1));
  });

  box.key(['S-right', 'S-l'], function () {
    render(depth = maxDepth);
  });

  box.key('d', function () {
    box.scroll(Math.floor(box.height / 2));
    box.screen.render();
  });

  box.key('u', function () {
    box.scroll(-Math.floor(box.height / 2));
    box.screen.render();
  });

  function render (depth) {
    lesspipe(foldable.fold(depth), function (err, content) {
      if (err) return error(err);
      box.setContent(content);
      box.screen.render();
    });
  }

  return box;
}
