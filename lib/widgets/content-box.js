'use strict';

var Foldable = require('../fold'),
    lesspipe = require('../lesspipe'),
    error = require('../error');

var blessed = require('blessed');


module.exports = function (screen, content) {
  var box = blessed.box({
    scrollable: true,
    alwaysScroll: true,
    scrollbar: true,
    keys: true,
    vi: true,
    border: {
      type: 'line'
    },
    tags: true,
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
    screen.render();
  });

  // Conflicts with ESC-u.
  box.key('u', function () {
    if (screen.data.escapeLock) return;
    box.scroll(-Math.floor(box.height / 2));
    screen.render();
  });

  function render (depth) {
    lesspipe(foldable.fold(depth), function (err, content) {
      if (err) return error(err);
      box.setContent(content);
      screen.render();
      screen.emit('app:render');
    });
  }

  return box;
};
