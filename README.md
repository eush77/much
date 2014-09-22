# ness-less

`ness-less` makes the nestness less. For the time being. Just so you could grasp the code at once.

But all it does, actually, is folding definitions of deeply nested functions.

## Example

[Browserify's core file](https://github.com/substack/node-browserify/blob/master/index.js) normally contains around 630 lines of code, but `ness-less` can extract a brief summary out of it. Different depth settings lead to different levels of granularity.

```shell
ness node-browserify/index.js
```

output:

```js
var mdeps = require('module-deps');
var depsSort = require('deps-sort');
var bpack = require('browser-pack');
var insertGlobals = require('insert-module-globals');
var syntaxError = require('syntax-error');

var builtins = require('./lib/builtins.js');

var splicer = require('labeled-stream-splicer');
var through = require('through2');
var concat = require('concat-stream');
var duplexer = require('duplexer2');

var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var xtend = require('xtend');
var copy = require('shallow-copy');
var isarray = require('isarray');
var defined = require('defined');

var bresolve = require('browser-resolve');
var resolve = require('resolve');

module.exports = Browserify;
inherits(Browserify, EventEmitter);

var path = require('path');
var paths = {
    empty: path.join(__dirname, 'lib/_empty.js')
};

function Browserify (files, opts) { /*..*/ }

Browserify.prototype.require = function (file, opts) { /*..*/ };

Browserify.prototype.add = function (file, opts) { /*..*/ };

Browserify.prototype.external = function (file, opts) { /*..*/ };

Browserify.prototype.exclude = function (file, opts) { /*..*/ };

Browserify.prototype.ignore = function (file, opts) { /*..*/ };

Browserify.prototype.transform = function (tr, opts) { /*..*/ };

Browserify.prototype.plugin = function (p, opts) { /*..*/ };

Browserify.prototype._createPipeline = function (opts) { /*..*/ };

Browserify.prototype._createDeps = function (opts) { /*..*/ };

Browserify.prototype._recorder = function (opts) { /*..*/ };

Browserify.prototype._json = function () { /*..*/ };

Browserify.prototype._unbom = function () { /*..*/ };

Browserify.prototype._syntax = function () { /*..*/ };

Browserify.prototype._dedupe = function () { /*..*/ };

Browserify.prototype._label = function (opts) { /*..*/ };

Browserify.prototype._emitDeps = function () { /*..*/ };

Browserify.prototype._debug = function (opts) { /*..*/ };

Browserify.prototype.reset = function (opts) { /*..*/ };

Browserify.prototype.bundle = function (cb) { /*..*/ };

function has (obj, key) { /*..*/ }
function isStream (s) { /*..*/ }
```

## CLI

`ness-less` will try to feed the output to your favorite $PAGER, so check up this variable.

```shell
ness [-DEPTH] file.js [PAGER_OPTIONS]...
```

However, if the output is redirected, `ness-less` will respect that.

```shell
ness -0 file.js |wc -l
```

## API

### nessLess(code, options)

| Option      | Type   | Required? |
| :---------- | :----- | :-------: |
| depth       | number | Yes       |
| placeholder | string | No        |

## Install

```shell
npm install -g ness-less
```

## License

MIT
