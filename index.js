'use strict';

var esprima = require('esprima')
  , estraverse = require('estraverse');


var isFunctionNode = function (node) {
  return /^Function/.test(node.type);
};


var stripEmptyLines = function (chunk) {
  var match = chunk.match(/^(.*)\n\s*\n(.*)$/);
  return match ? match[1] + '\n' + match[2] : chunk;
};


/**
 * Fold deeply nested functions.
 *
 * @arg {string} code
 * @arg {Object} options
 * @property {number} depth - Maximum depth level.
 * @property {string} [placeholder]
 * @property {boolean} [stripEmptyLines=true] - Remove excessive whitespace between processed lines.
 * @return {string}
 */
module.exports = function (code, options) {
  options.placeholder = options.placeholder || ' /*..*/ ';
  if (options.stripEmptyLines == null) {
    options.stripEmptyLines = true;
  }

  var replacer = '{' + options.placeholder + '}';

  var ast = esprima.parse(code, {
    range: true
  });

  var output = []
    , pos = 0
    , depth = 0;

  estraverse.traverse(ast, {
    enter: function (node) {
      if (isFunctionNode(node)) {
        if (options.depth < ++depth) {
          var chunk = code.slice(pos, node.body.range[0]);
          if (options.stripEmptyLines) {
            chunk = stripEmptyLines(chunk);
          }

          output.push(chunk, replacer);
          pos = node.body.range[1];
          this.skip();
        }
      }
    },
    leave: function (node) {
      if (isFunctionNode(node)) {
        depth -= 1;
      }
    }
  });

  output.push(code.slice(pos));
  return output.join('');
};
