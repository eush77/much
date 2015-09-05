'use strict';

var blessed = require('blessed');


module.exports = function (opts) {
  var input = blessed.textbox(opts);

  input.key('backspace', function () {
    if (!input.value) {
      input.cancel();
    }
  });

  return input;
};
