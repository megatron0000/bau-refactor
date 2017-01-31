"use strict";
var ts = require("ntypescript");
function printAllChildren(node, depth) {
    if (depth === void 0) { depth = 0; }
    console.log(new Array(depth + 1).join('----'), ts.syntaxKindToName(node.kind), node.pos, node.end);
    depth++;
    ts.forEachChild(node, function (c) { return printAllChildren(c, depth); });
}
var file = ts.createSourceFile('foo.ts', "\n    import * as baz from '../baz';\n    import * as bar from '../subpackage/bar';\n    import * as bas from '../second-package/foooo';\n    import * as n from '../third-package/fo';\n    import foo = require('./third-package/commonjs');\n    ", ts.ScriptTarget.ES5);
printAllChildren(file);
// let file = path.resolve(__dirname, 'typescript-hero', 'src', 'IoC.ts');
// let sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.ES5, true);
// console.log(sourceFile.fileName);
// let options = ts.convertCompilerOptionsFromJson(JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')).compilerOptions,
//     __dirname,
//     'tsconfig.json');
// ts.parseJsonConfigFileContent(JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')), )
// let program = ts.createProgram([file], options.options);
// console.log(ts.preProcessFile(fs.readFileSync(file, 'utf8')).importedFiles.map(file => file.fileName));
