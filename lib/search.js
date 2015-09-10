'use strict';

var error = require('./error');

var blessed = require('blessed');


module.exports = function (screen) {
  var $ = screen.$, _ = screen._;

  var content;  // Stays in sync with the actual content being displayed.
  var search, searchIndex, lines;  // Internal search state.

  screen.on('app:render', function () {
    content = $.contentBox.getContent();
    searchIndex = -1;
  });

  screen.key('/', function () {
    _.showInput();
    $.input.setValue('/');
    screen.render();

    $.input.readInput(function (err, value) {
      if (err) return error(err);

      if (value) {
        search = value.slice(1);
        initSearch();
      }

      _.hideInput();
      screen.render();
    });
  });

  screen.key('escape', function () {
    screen.onceKey('u', function () {
      clearHighlight();
      searchIndex = -1;
      search = null;
      screen.render();
    });
  });

  screen.key('n', searchFunction(nextSearchIndex));
  screen.key('S-n', searchFunction(previousSearchIndex));

  function searchFunction (nextSearchIndex) {
    return function fn () {
      if (searchIndex < 0) {
        if (search) {
          // Re-search. The depth could change.
          if (initSearch()) {
            return fn.apply(this, arguments);
          }
        }
        return;
      }

      searchIndex = nextSearchIndex(searchIndex, lines, search);

      $.contentBox.scrollTo(searchIndex);
      screen.render();
    };
  }

  function initSearch () {
    clearHighlight();
    lines = $.contentBox.getScreenLines();
    searchIndex = firstSearchIndex(lines, search);

    if (searchIndex >= 0) {
      $.contentBox.scrollTo(searchIndex);
      highlightMatches();
    }

    return searchIndex >= 0;
  }

  function highlightMatches () {
    $.contentBox.setContent(highlight(content, search));
  }

  function clearHighlight () {
    $.contentBox.setContent(content);
  }
};


var firstSearchIndex = findSearchIndex.bind(null, +1, -1);
var nextSearchIndex = findSearchIndex.bind(null, +1);
var previousSearchIndex = findSearchIndex.bind(null, -1);


function findSearchIndex (delta, startIndex, lines, search) {
  for (var i = startIndex + delta; 0 <= i && i < lines.length; i += delta) {
    if (RegExp(search).test(blessed.stripTags(lines[i]))) {
      return i;
    }
  }
  return startIndex;
}


function highlight (content, search) {
  return content.replace(RegExp(search, 'g'), '{yellow-fg}$&{/yellow-fg}');
}
