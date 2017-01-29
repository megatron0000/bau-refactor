#!/usr/bin/env node

import { BauEdgeSet } from '../bau-edge-set';
import { BauNodeSet } from '../bau-node-set';
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
    label: source.getProjectRelativePath(),
    dependencies: source.getRelativeImports()
        // do not care about line
        .map(importt => importt.path)
        // convert to root-relative path
        .map(fileRelative => path.join(source.getProjectRelativeDir(), fileRelative))
        // add .ts extension, or resolve to 'index.ts' inside a folder
        .map(noExtension => {
            // Try to parse as a file
            if (fs.existsSync(path.resolve(project.getAbsPath(), noExtension + '.ts'))) {
                return noExtension + '.ts';
            }
            // Then, knowing it is a directory, search for package.json and/or index.ts inside it
            let dirContents = fs.readdirSync(path.resolve(project.getAbsPath(), noExtension));
            let packageJson = dirContents.find(content => content === 'package.json');
            let indexTs = dirContents.find(content => content === 'index.ts');
            // No package but Yes index
            if (!packageJson && indexTs) {
                return path.join(noExtension, 'index.ts');
            }
            // Yes package AND Yes .main
            if (packageJson) {
                let packageContent = JSON.parse(fs.readFileSync(
                    path.resolve(project.getAbsPath(), noExtension, 'package.json'),
                    'utf8'
                ));
                if (packageContent.main) {
                    return path.join(noExtension, packageContent.main.replace(/(.js)$/, '.ts'));
                }
            }
            // Either (No package No index) or (Yes package No .main)
            throw new ReferenceError(`Package ${noExtension} has some oddity regarding its main file`);
        })
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
