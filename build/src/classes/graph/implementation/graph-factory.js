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
var dependency_graph_1 = require("./dependency-graph");
var inversify_1 = require("inversify");
var GraphFactory = (function () {
    function GraphFactory(projectFactory, nodeFactory, edgeFactory, pathService) {
        this.projectFactory = projectFactory;
        this.nodeFactory = nodeFactory;
        this.edgeFactory = edgeFactory;
        this.pathService = pathService;
        this.graphSingleton = null;
    }
    GraphFactory.prototype.createGraph = function () {
        this.graphSingleton = this.graphSingleton || new dependency_graph_1.DependencyGraph(this.projectFactory, this.nodeFactory, this.edgeFactory, this.pathService);
        return this.graphSingleton;
    };
    return GraphFactory;
}());
GraphFactory = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('IProjectFactory')),
    __param(1, inversify_1.inject('INodeFactory')),
    __param(2, inversify_1.inject('IEdgeFactory')),
    __param(3, inversify_1.inject('IPathService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GraphFactory);
exports.GraphFactory = GraphFactory;
