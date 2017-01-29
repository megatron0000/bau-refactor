#!/usr/bin/env node
"use strict";
var bau_edge_set_1 = require("../bau-edge-set");
var bau_node_set_1 = require("../bau-node-set");
var bau_project_1 = require("../bau-project");
var fs = require("fs-extra");
var path = require("path");
var cwd = process.cwd();
/**
 * Create a BauProject
 */
console.log('Reading your project...');
var project = new bau_project_1.BauProject();
console.log('DONE\n');
/**
 * Map from BauSourceFile schema to BauDependencyGraph schema
 */
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
/**
 * Build BauDependencyGraph
 */
var nodeSet = new bau_node_set_1.BauNodeSet(nodes);
var edgeSet = new bau_edge_set_1.BauEdgeSet(nodeSet);
/**
 * Write dependency-map.json
 */
var dependencyMap = JSON.stringify({
    nodes: nodeSet.asArray(),
    edges: edgeSet.asArray()
});
/**
 * Transfer @root/build to userDir/bau-analyse
 */
console.log('Creating bau-analyse directory...');
fs.copySync(path.resolve(__dirname, '../html'), path.resolve(cwd, 'bau-analyse'));
console.log('DONE\n');
/**
 * Transfer generated dependency-map.json to userDir/bau-analyse/html/database
 */
console.log('Finishing...');
fs.writeFileSync(path.resolve(cwd, 'bau-analyse', 'database', 'dependency-map.json'), dependencyMap);
console.log('DONE');
