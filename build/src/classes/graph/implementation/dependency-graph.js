"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Uses POSIX paths for node labels
 *
 * Any path inputted in methods is converted to POSIX for you
 */
var DependencyGraph = (function () {
    /**
     * Throws error if any dependency cannot be found
     * in the file system
     */
    function DependencyGraph(projectFactory, nodeFactory, edgeFactory, pathService) {
        this.nodeFactory = nodeFactory;
        this.edgeFactory = edgeFactory;
        this.pathService = pathService;
        this.build(projectFactory.getSingletonProject());
    }
    /**
     * Uses POSIX paths as node labels
     *
     * Throws error if any dependency cannot be found
     * in the file system
     */
    DependencyGraph.prototype.build = function (project) {
        /**
         * - Make all labels be project-relative paths
         * - Resolve implicit names (like non-written index.ts)
         */
        var nodes = project.getSources().map(function (source) { return ({
            // Had forgotten to convert to POSIX here too
            label: source.getProjectRelativePath().toString(),
            dependencies: source.getRelativeImports()
                .map(function (importt) { return importt.resolved.toString(); })
        }); });
        this.nodeSet = this.nodeFactory.createNodeSet(nodes);
        this.edgeSet = this.edgeFactory.createEdgeSet(this.nodeSet);
    };
    /**
     * Accepts only project-relative fileName
     *
     * Throws Error if fileName is not part of project
     */
    DependencyGraph.prototype.getDependents = function (filePath) {
        var _this = this;
        var fileName = filePath.toString();
        // IInternalPath already produces POSIX
        var id = this.nodeSet.byLabel(fileName).id;
        return this.edgeSet.asArray()
            .filter(function (edge) { return edge.to === id; })
            .map(function (edge) { return edge.from; })
            .map(function (fromId) { return _this.nodeSet.byId(fromId).label; })
            .map(function (stringPath) { return _this.pathService.createInternal(stringPath); });
    };
    /**
     * Accepts only project-relative fileName
     *
     * Throws Error if fileName is not part of project
     */
    DependencyGraph.prototype.getDependencies = function (filePath) {
        var _this = this;
        var fileName = filePath.toString();
        // IInternalPath already outputs POSIX
        var id = this.nodeSet.byLabel(fileName).id;
        return this.edgeSet.asArray()
            .filter(function (edge) { return edge.from === id; })
            .map(function (edge) { return edge.to; })
            .map(function (toId) { return _this.nodeSet.byId(toId).label; })
            .map(function (stringPath) { return _this.pathService.createInternal(stringPath); });
    };
    return DependencyGraph;
}());
exports.DependencyGraph = DependencyGraph;
