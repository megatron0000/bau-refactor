#!/usr/bin/env node

import { BauEdgeSet } from '../graph/bau-edge-set';
import { BauNodeSet } from '../graph/bau-node-set';
import { BauProject } from '../bau-project';
import fs = require('fs-extra');
import path = require('path');

let cwd = process.cwd();

/**
 * Create a BauProject
 */
console.log('Reading your project...');
let project = new BauProject();
console.log('DONE\n');

/**
 * Map from BauSourceFile schema to BauDependencyGraph schema
 */
let nodes = project.getBauSources().map(source => ({
    label: source.getProjectRelativePath().replace(/\\/g, '/'),
    dependencies: source.getRelativeImports()
        // do not care about line
        .map(importt => importt.path)
        // convert to root-relative path
        .map(fileRelative => path.join(source.getProjectRelativeDir(), fileRelative))
        // convert to POSIX
        .map(win32 => win32.replace(/\\/g, '/'))
}));


/**
 * Build BauDependencyGraph
 */
let nodeSet = new BauNodeSet(nodes);
let edgeSet = new BauEdgeSet(nodeSet);


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
