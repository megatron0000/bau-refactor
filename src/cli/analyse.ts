#!/usr/bin/env node
import { EdgeSet } from '../classes/graph/subcomponents/implementation/edge-set';
import { NodeSet } from '../classes/graph/subcomponents/implementation/node-set';
import { IProjectFactory } from '../classes/project/i-project-factory';
import { ContainerBuilder } from '../inversify.config';
import fs = require('fs-extra');
import path = require('path');

let container = new ContainerBuilder().build();
let cwd = process.cwd();

/**
 * Create a BauProject
 */
console.log('Reading your project...');
let project = container.get<IProjectFactory>('IProjectFactory').getSingletonProject();
console.log('DONE\n');

/**
 * Map from BauSourceFile schema to BauDependencyGraph schema
 */
let nodes = project.getSources().map(source => ({
    label: source.getProjectRelativePath().toString(),
    dependencies: source.getRelativeImports()
        // do not care about line
        .map(importt => importt.resolved.toString())
}));


/**
 * Build BauDependencyGraph
 */
let nodeSet = new NodeSet(nodes);
let edgeSet = new EdgeSet(nodeSet);


/**
 * Write dependency-map.json
 */
let dependencyMap: string = JSON.stringify({
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
