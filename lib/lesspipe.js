'use strict';

var tmpPath = require('gettemporaryfilepath');

var fs = require('fs'),
    exec = require('child_process').exec;


var cachedLessOpen;


module.exports = function (data, cb) {
  if (!lessopen()) {
    return process.nextTick(cb.bind(null, null, data));
  }

  var path = tmpPath() + '.js';

  fs.writeFile(path, data, function (err) {
    if (err) return cb(err);

    exec(lessopen().replace('%s', path), {
      maxBuffer: Infinity
    }, function (err, stdout) {
      var lastErr = err;

      fs.unlink(path, function (err) {
        if (err = lastErr || err) return cb(err);
        cb(null, stdout);
      });
    });
  });
};


function lessopen () {
  if (cachedLessOpen != null) return cachedLessOpen;

  var lessopen = process.env.LESSOPEN;

  if (!lessopen) {
    return cachedLessOpen = '';
  }

  if (lessopen[0] != '|') {
    throw Error('Unsupported $LESSOPEN: must be an input pipe.');
  }
  lessopen = lessopen.replace(/^\|-?/, '');

  return cachedLessOpen = lessopen;
}
