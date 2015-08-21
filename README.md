[![npm](https://nodei.co/npm/much.png)](https://nodei.co/npm/much/)

# much

[![Dependency Status][david-badge]][david]

[david-badge]: https://david-dm.org/eush77/much.png
[david]: https://david-dm.org/eush77/much

`much` — pager with depth support.

`much` folds definitions of deeply nested functions and objects.

## Example

[Browserify's core file](https://github.com/substack/node-browserify/blob/master/index.js) normally contains around 630 lines of code, but `much` can extract a brief summary out of it. Different depth settings lead to different levels of granularity.

```shell
much node-browserify/index.js
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
var paths = { /*..*/ };
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

`much` will try to feed the output to your favorite $PAGER, so check up this variable.

```shell
much [-DEPTH] file.js [PAGER_OPTIONS]...
```

However, if the output is redirected, `much` will respect that.

```shell
much -0 file.js |wc -l
```

## API

### much(code, options)

| Option          | Type    | Required? | Default |
| :-------------- | :------ | :-------: | :------ |
| depth           | number  | Yes       |         |
| placeholder     | string  | No        |         |
| stripEmptyLines | boolean | No        | `true`  |

## Install

```shell
npm install -g much
```

## License

MIT
