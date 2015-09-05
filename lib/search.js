'use strict';

var error = require('./error');


module.exports = function (screen) {
  var $ = screen.$, _ = screen._;

  var search;

  screen.key('/', function () {
    _.showInput();
    $.input.setValue('/');
    screen.render();

    $.input.readInput(function (err, value) {
      if (err) return error(err);

      search = value;

      _.hideInput();
      screen.render();
    });
  });
};
