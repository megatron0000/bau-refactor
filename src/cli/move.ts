#!/usr/bin/env node

import { BauFileMover } from '../bau-file-mover';
import { BauDependencyGraph } from '../graph/bau-dependency-graph';
import { BauProject } from '../project/bau-project';


let project = new BauProject();
let graph = new BauDependencyGraph(project);
// console.log('graph', graph.nodeSet);
let fileMover = new BauFileMover(project, graph);

fileMover.move(process.argv[2], process.argv[3]);
