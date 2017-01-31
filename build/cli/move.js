#!/usr/bin/env node
"use strict";
var bau_file_mover_1 = require("../bau-file-mover");
var bau_dependency_graph_1 = require("../graph/bau-dependency-graph");
var bau_project_1 = require("../bau-project");
var project = new bau_project_1.BauProject();
var graph = new bau_dependency_graph_1.BauDependencyGraph(project);
// console.log('graph', graph.nodeSet);
var fileMover = new bau_file_mover_1.BauFileMover(project, graph);
fileMover.move(process.argv[2], process.argv[3]);
