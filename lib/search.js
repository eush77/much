'use strict';

var error = require('./error');


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
        lines = $.contentBox.getLines();
        search = value.slice(1);
        searchIndex = firstSearchIndex(lines, search);

        if (searchIndex >= 0) {
          $.contentBox.scrollTo(searchIndex);
        }
        else {
          search = null;
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
