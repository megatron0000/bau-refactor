"use strict";
var bau_edge_set_1 = require("./bau-edge-set");
var bau_node_set_1 = require("./bau-node-set");
var bau_project_1 = require("./bau-project");
var fs = require("fs");
var path = require("path");
/**
 * Program itself
 */
// let file = path.resolve(__dirname, 'typescript-hero', 'src', 'IoC.ts');
// let sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.ES5, true);
// console.log(sourceFile.fileName);
var project = new bau_project_1.BauProject();
var nodes = project.getBauSources().map(function (source) { return ({
    label: source.getProjectRelativePath(),
    dependencies: source.getRelativeImports()
        .map(function (importt) { return importt.path; })
        .map(function (fileRelative) { return path.join(source.getProjectRelativeDir(), fileRelative); })
        .map(function (noExtension) {
        // Try to parse as a file
        if (fs.existsSync(path.resolve(project.getAbsPath(), noExtension + '.ts'))) {
            return noExtension + '.ts';
        }
        // Then, knowing it is a directory, search for package.json and/or index.ts inside it
        var dirContents = fs.readdirSync(path.resolve(project.getAbsPath(), noExtension));
        var packageJson = dirContents.find(function (content) { return content === 'package.json'; });
        var indexTs = dirContents.find(function (content) { return content === 'index.ts'; });
        // No package but Yes index
        if (!packageJson && indexTs) {
            return path.join(noExtension, 'index.ts');
        }
        // Yes package AND Yes .main
        if (packageJson) {
            var packageContent = JSON.parse(fs.readFileSync(path.resolve(project.getAbsPath(), noExtension, 'package.json'), 'utf8'));
            if (packageContent.main) {
                return path.join(noExtension, packageContent.main.replace(/(.js)$/, '.ts'));
            }
        }
        // Either (No package No index) or (Yes package No .main)
        throw new ReferenceError("Package " + noExtension + " has some oddity regarding its main file");
    })
}); });
var nodeSet;
var edgeSet;
nodeSet = new bau_node_set_1.BauNodeSet(nodes);
edgeSet = new bau_edge_set_1.BauEdgeSet(nodeSet);
console.log('nodes', nodes);
console.log('BauNodeSet', nodeSet);
console.log('BauEdgeSet', edgeSet);
fs.writeFileSync('./out.json', JSON.stringify({
    nodes: nodeSet.asArray(),
    edges: edgeSet.asArray()
}));
module.exports = bau_project_1.BauProject;
/**
 * END
 */
// let options = ts.convertCompilerOptionsFromJson(JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')).compilerOptions,
//     __dirname,
//     'tsconfig.json');
// ts.parseJsonConfigFileContent(JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')), )
// let program = ts.createProgram([file], options.options);
// console.log(ts.preProcessFile(fs.readFileSync(file, 'utf8')).importedFiles.map(file => file.fileName));
