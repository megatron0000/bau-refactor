#!/usr/bin/env node
"use strict";
var edge_set_1 = require("../classes/graph/subcomponents/implementation/edge-set");
var node_set_1 = require("../classes/graph/subcomponents/implementation/node-set");
var inversify_config_1 = require("../inversify.config");
var fs = require("fs-extra");
var path = require("path");
var cwd = process.cwd();
/**
 * Create a BauProject
 */
console.log('Reading your project...');
var project = inversify_config_1.container.get('IProjectFactory').getSingletonProject();
console.log('DONE\n');
/**
 * Map from BauSourceFile schema to BauDependencyGraph schema
 */
var nodes = project.getSources().map(function (source) { return ({
    label: source.getProjectRelativePath().replace(/\\/g, '/'),
    dependencies: source.getRelativeImports()
        .map(function (importt) { return importt.path; })
        .map(function (fileRelative) { return path.join(source.getProjectRelativeDir(), fileRelative); })
        .map(function (win32) { return win32.replace(/\\/g, '/'); })
}); });
/**
 * Build BauDependencyGraph
 */
var nodeSet = new node_set_1.NodeSet(nodes);
var edgeSet = new edge_set_1.EdgeSet(nodeSet);
/**
 * Write dependency-map.json
 */
var dependencyMap = JSON.stringify({
    nodes: nodeSet.asArray(),
    edges: edgeSet.asArray()
});
/**
 * Transfer @root/build to userDir/bau-analyse, only if
 * it does not exist already
 */
console.log('Creating bau-analyse directory...');
if (!fs.existsSync(path.resolve(cwd, 'bau-analyse'))) {
    fs.copySync(path.resolve(__dirname, '../html'), path.resolve(cwd, 'bau-analyse'));
}
console.log('DONE\n');
/**
 * Transfer generated dependency-map.json to userDir/bau-analyse/html/database
 */
console.log('Finishing...');
fs.writeFileSync(path.resolve(cwd, 'bau-analyse', 'database', 'dependency-map.json'), dependencyMap);
console.log('DONE');
