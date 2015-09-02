'use strict';

var acorn = require('acorn'),
    estraverse = require('estraverse');


module.exports = function FoldableSource (source) {
  var ast = acorn.parse(source, {
    allowHashBang: true,
    ecmaVersion: 6,
    sourceType: 'module',
    ranges: true,
    locations: true
  });

  var replacer = '{ /*..*/ }';

  return {
    maxDepth: function () {
      var maxDepth = 0, depth = 0;

      estraverse.traverse(ast, {
        enter: function (node) {
          if (isFoldableNode(node)) {
            if (maxDepth < ++depth) {
              maxDepth = depth;
            }
          }
        },
        leave: function (node) {
          if (isFoldableNode(node)) {
            depth -= 1;
          }
        }
      });

      return maxDepth;
    },
    fold: function (maxDepth) {
      var output = [],
          pos = 0,
          depth = 0;

      var skipRange = function (node) {
        var chunk = source.slice(pos, node.start);
        chunk = stripEmptyLines(chunk);
        output.push(chunk, replacer);
        pos = node.end;
      };

      estraverse.traverse(ast, {
        enter: function (node) {
          if (isFoldableNode(node)) {
            if (maxDepth < ++depth) {
              skipRange(node);
              this.skip();
            }
          }
        },
        leave: function (node) {
          if (isFoldableNode(node)) {
            depth -= 1;
          }
        }
      });

      output.push(source.slice(pos));
      return output.join('');
    }
  };
};


function isBlockNode (node) {
  return node.type == 'BlockStatement' || node.type == 'ObjectExpression';
}


function isFoldableNode (node) {
  return isBlockNode(node) && node.loc.start.line < node.loc.end.line;
}


function stripEmptyLines (chunk) {
  var match = chunk.match(/^(.*)\n\s*\n(.*)$/);
  return match ? match[1] + '\n' + match[2] : chunk;
}
