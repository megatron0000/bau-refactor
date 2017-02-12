"use strict";
var bau_edge_set_1 = require("./bau-edge-set");
var bau_node_set_1 = require("./bau-node-set");
var path = require("path");
/**
 * Uses POSIX paths for node labels
 *
 * Any path inputted in methods is converted to POSIX for you
 */
var BauDependencyGraph = (function () {
    /**
     * Throws error if any dependency cannot be found
     * in the file system
     */
    function BauDependencyGraph(project) {
        this.build(project);
    }
    /**
     * Uses POSIX paths as node labels
     *
     * Throws error if any dependency cannot be found
     * in the file system
     */
    BauDependencyGraph.prototype.build = function (project) {
        /**
         * - Make all labels be project-relative paths
         * - Resolve implicit names (like non-written index.ts)
         */
        var nodes = project.getBauSources().map(function (source) { return ({
            // Had forgotten to convert to POSIX here too
            label: source.getProjectRelativePath().replace(/\\/g, '/'),
            dependencies: source.getRelativeImports()
                .map(function (importt) { return importt.path; })
                .map(function (fileRelative) { return path.join(source.getProjectRelativeDir(), fileRelative); })
                .map(function (winPath) { return winPath.replace(/\\/g, '/'); })
        }); });
        this.nodeSet = new bau_node_set_1.BauNodeSet(nodes);
        this.edgeSet = new bau_edge_set_1.BauEdgeSet(this.nodeSet);
    };
    /**
     * Accepts only project-relative fileName
     *
     * Throws Error if fileName is not part of project
     */
    BauDependencyGraph.prototype.getDependents = function (fileName) {
        var _this = this;
        // Assure path is POSIX
        var id = this.nodeSet.byLabel(path.normalize(fileName).replace(/\\/g, '/')).id;
        return this.edgeSet.asArray()
            .filter(function (edge) { return edge.to === id; })
            .map(function (edge) { return edge.from; })
            .map(function (fromId) { return _this.nodeSet.byId(fromId).label; });
    };
    /**
     * Accepts only project-relative fileName
     *
     * Throws Error if fileName is not part of project
     */
    BauDependencyGraph.prototype.getDependencies = function (fileName) {
        var _this = this;
        // Assure path is POSIX
        var id = this.nodeSet.byLabel(path.normalize(fileName).replace(/\\/g, '/')).id;
        return this.edgeSet.asArray()
            .filter(function (edge) { return edge.from === id; })
            .map(function (edge) { return edge.to; })
            .map(function (toId) { return _this.nodeSet.byId(toId).label; });
    };
    return BauDependencyGraph;
}());
exports.BauDependencyGraph = BauDependencyGraph;
