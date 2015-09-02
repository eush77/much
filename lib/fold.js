'use strict';

var acorn = require('acorn'),
    estraverse = require('estraverse');


/**
 * Fold deeply nested blocks.
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
      if (isBlockNode(node)) {
        if (options.depth < ++depth) {
          skipRange(node);
          this.skip();
        }
      }
    },
    leave: function (node) {
      if (isBlockNode(node)) {
        depth -= 1;
      }
    }
  });

  output.push(code.slice(pos));
  return output.join('');
};


function isBlockNode (node) {
  return node.type == 'BlockStatement' || node.type == 'ObjectExpression';
}


function stripEmptyLines (chunk) {
  var match = chunk.match(/^(.*)\n\s*\n(.*)$/);
  return match ? match[1] + '\n' + match[2] : chunk;
}
