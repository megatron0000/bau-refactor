"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var text_file_factory_1 = require("./classes/project/implementation/text-file-factory");
var graph_factory_1 = require("./classes/graph/implementation/graph-factory");
var edge_factory_1 = require("./classes/graph/subcomponents/implementation/edge-factory");
var node_factory_1 = require("./classes/graph/subcomponents/implementation/node-factory");
var file_mover_1 = require("./classes/mover/implementation/file-mover");
var project_factory_1 = require("./classes/project/implementation/project-factory");
var source_file_factory_1 = require("./classes/project/implementation/source-file-factory");
var import_service_1 = require("./classes/utils/implementation/import-service");
var inversify_1 = require("inversify");
var strong_paths_1 = require("strong-paths");
var ContainerBuilder = (function () {
    function ContainerBuilder() {
    }
    ContainerBuilder.prototype.build = function () {
        var container = new inversify_1.Container();
        /**
         * graph/
         */
        container.bind('IEdgeFactory').to(edge_factory_1.EdgeFactory);
        container.bind('INodeFactory').to(node_factory_1.NodeFactory);
        container.bind('IGraphFactory').to(graph_factory_1.GraphFactory).inSingletonScope();
        /**
         * mover/
         */
        container.bind('IFileMover').to(file_mover_1.FileMover);
        /**
         * project/
         */
        container.bind('IProjectFactory').to(project_factory_1.ProjectFactory).inSingletonScope();
        container.bind('ISourceFileFactory').to(source_file_factory_1.SourceFileFactory);
        container.bind('ITextFileFactory').to(text_file_factory_1.TextFileFactory);
        /**
         * utils/
         */
        container.bind('IImportService').to(import_service_1.ImportService);
        container.bind('IPathService').to(strong_paths_1.PathService).inSingletonScope();
        container.bind('IInternalPath').to(strong_paths_1.InternalPath);
        container.bind('IAbsolutePath').to(strong_paths_1.AbsolutePath);
        return container;
    };
    return ContainerBuilder;
}());
exports.ContainerBuilder = ContainerBuilder;
