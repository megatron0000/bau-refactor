"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var inversify_1 = require("inversify");
var path = require("path");
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
    function DependencyGraph(projectFactory, nodeFactory, edgeFactory) {
        this.nodeFactory = nodeFactory;
        this.edgeFactory = edgeFactory;
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
            label: source.getProjectRelativePath().replace(/\\/g, '/'),
            dependencies: source.getRelativeImports()
                .map(function (importt) { return importt.path; })
                .map(function (fileRelative) { return path.join(source.getProjectRelativeDir(), fileRelative); })
                .map(function (winPath) { return winPath.replace(/\\/g, '/'); })
        }); });
        this.nodeSet = this.nodeFactory.createNodeSet(nodes);
        this.edgeSet = this.edgeFactory.createEdgeSet(this.nodeSet);
    };
    /**
     * Accepts only project-relative fileName
     *
     * Throws Error if fileName is not part of project
     */
    DependencyGraph.prototype.getDependents = function (fileName) {
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
    DependencyGraph.prototype.getDependencies = function (fileName) {
        var _this = this;
        // Assure path is POSIX
        var id = this.nodeSet.byLabel(path.normalize(fileName).replace(/\\/g, '/')).id;
        return this.edgeSet.asArray()
            .filter(function (edge) { return edge.from === id; })
            .map(function (edge) { return edge.to; })
            .map(function (toId) { return _this.nodeSet.byId(toId).label; });
    };
    return DependencyGraph;
}());
DependencyGraph = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('IProjectFactory')),
    __param(1, inversify_1.inject('INodeFactory')),
    __param(2, inversify_1.inject('IEdgeFactory')),
    __metadata("design:paramtypes", [Object, Object, Object])
], DependencyGraph);
exports.DependencyGraph = DependencyGraph;
