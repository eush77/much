'use strict';


module.exports = function (screen) {
  screen.key('escape', function () {
    if (screen.data.escapeLock) return;
    screen.data.escapeLock = true;

    screen.once('keypress', function () {
      // Ensure that escape handler gets the message first.
      process.nextTick(function () {
        screen.data.escapeLock = false;
      });
    });
  });
};
