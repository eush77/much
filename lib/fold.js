'use strict';

var acorn = require('acorn'),
    estraverse = require('estraverse');


var isFunctionNode = function (node) {
  return /^Function/.test(node.type);
};

var isObjectNode = function (node) {
  return node.type == 'ObjectExpression';
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
 * @return {string}
 */
module.exports = function (code, options) {
  var ast = acorn.parse(code, {
    allowHashBang: true,
    ecmaVersion: 6,
    sourceType: 'module',
    ranges: true
  });

  var replacer = '{ /*..*/ }';

  var output = []
    , pos = 0
    , depth = 0;

  var skipRange = function (node) {
    var chunk = code.slice(pos, node.start);
    chunk = stripEmptyLines(chunk);

    output.push(chunk, replacer);
    pos = node.end;
  };

  estraverse.traverse(ast, {
    enter: function (node) {
      if (isFunctionNode(node)) {
        if (options.depth < ++depth) {
          skipRange(node.body);
          this.skip();
        }
      }
      else if (isObjectNode(node)) {
        if (options.depth < ++depth) {
          skipRange(node);
          this.skip();
        }
      }
    },
    leave: function (node) {
      if (isFunctionNode(node) || isObjectNode(node)) {
        depth -= 1;
      }
    }
  });

  output.push(code.slice(pos));
  return output.join('');
};
