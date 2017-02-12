import ts = require('ntypescript');

function printAllChildren(node: ts.Node, depth = 0) {
    console.log(new Array(depth + 1).join('----'), ts.syntaxKindToName(node.kind), node.pos, node.end);
    depth++;
    ts.forEachChild(node, c => printAllChildren(c, depth));
}

let file = ts.createSourceFile(
    'foo.ts',
    `
    import * as baz from '../baz';
    import * as bar from '../subpackage/bar';
    import * as bas from '../second-package/foooo';
    import * as n from '../third-package/fo';
    import foo = require('./third-package/commonjs');
    `,
    ts.ScriptTarget.ES5
);

printAllChildren(file);
