'use strict';

var blessed = require('blessed');


module.exports = function (err) {
  blessed.screen.instances[0].destroy();
  console.error(err.toString());
  process.exit(2);
};
