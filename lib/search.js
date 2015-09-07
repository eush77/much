'use strict';

var error = require('./error');

var blessed = require('blessed');


module.exports = function (screen) {
  var $ = screen.$, _ = screen._;

  var content, lines, search, searchIndex;

  screen.key('/', function () {
    _.showInput();
    $.input.setValue('/');
    screen.render();

    $.input.readInput(function (err, value) {
      if (err) return error(err);

      if (value) {
        clearHighlight();
        lines = $.contentBox.getScreenLines();
        search = value.slice(1);
        searchIndex = firstSearchIndex(lines, search);

        if (searchIndex < 0) {
          search = null;
        }

        if (search) {
          $.contentBox.scrollTo(searchIndex);
          highlightMatches();
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

      searchIndex = nextSearchIndex(searchIndex, lines, search);

      $.contentBox.scrollTo(searchIndex);
      screen.render();
    };
  }

  function highlightMatches () {
    if (!content) {
      content = $.contentBox.getContent();
    }
    $.contentBox.setContent(highlight(content, search));
  }

  function clearHighlight () {
    if (content) {
      $.contentBox.setContent(content);
    }
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


function highlight (content, search) {
  return content.replace(RegExp(search, 'g'), '{yellow-fg}' + search + '{/yellow-fg}');
}
