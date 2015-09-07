'use strict';

var error = require('./error');

var blessed = require('blessed');


module.exports = function (screen) {
  var $ = screen.$, _ = screen._;

  var lines, search, searchIndex;

  screen.key('/', function () {
    _.showInput();
    $.input.setValue('/');
    screen.render();

    $.input.readInput(function (err, value) {
      if (err) return error(err);

      if (value) {
        lines = $.contentBox.getScreenLines();
        search = value.slice(1);
        moveSearchCursor(firstSearchIndex(lines, search));

        if (search) {
          $.contentBox.scrollTo(searchIndex);
        }
      }

      _.hideInput();
      screen.render();
    });
  });

  screen.key('n', searchFunction(nextSearchIndex));
  screen.key('S-n', searchFunction(previousSearchIndex));

  function searchFunction (nextSearchIndex) {
    return function () {
      if (!search) return;

      moveSearchCursor(nextSearchIndex(searchIndex, lines, search));

      $.contentBox.scrollTo(searchIndex);
      screen.render();
    };
  }

  function moveSearchCursor (nextSearchIndex) {
    if (nextSearchIndex < 0) {
      search = searchIndex = null;
      return;
    }

    if (searchIndex) {
      $.contentBox.setLine(searchIndex, lines[searchIndex]);
    }

    searchIndex = nextSearchIndex;
    $.contentBox.setLine(searchIndex, highlightLine(lines[searchIndex], search));
  }
};


var firstSearchIndex = findSearchIndex.bind(null, +1, -1);
var nextSearchIndex = findSearchIndex.bind(null, +1);
var previousSearchIndex = findSearchIndex.bind(null, -1);


function findSearchIndex (delta, startIndex, lines, search) {
  for (var i = startIndex + delta; 0 <= i && i < lines.length; i += delta) {
    if (lines[i].indexOf(search) >= 0) {
      return i;
    }
  }
  return startIndex;
}


function highlightLine (line, search) {
  return line.replace(search, '{yellow-fg}' + search + '{/yellow-fg}');
}
