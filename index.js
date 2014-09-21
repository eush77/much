'use strict';

var esprima = require('esprima')
  , estraverse = require('estraverse');


var isFunctionNode = function (node) {
  return /^Function/.test(node.type);
};


/**
 * Fold deeply nested functions.
 *
 * @arg {string} code
 * @arg {Object} options
 * @property {number} depth - Maximum depth level.
 * @property {string} [placeholder]
 * @return {string}
 */
module.exports = function (code, options) {
  options.placeholder = options.placeholder || ' /*..*/ ';

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
          output.push(code.slice(pos, node.body.range[0]), replacer);
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
