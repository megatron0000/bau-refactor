"use strict";
/// <reference types="jasmine" />
var inversify_config_1 = require("../../../src/inversify.config");
var path = require("path");
var paths = {
    project: '../../mock-project'
};
var container = new inversify_config_1.ContainerBuilder().build();
/**
 * We create a project (singleton) so that DependencyGraph will
 * be created on top of it (otherwise, graph would create a default
 * project - with root at cwd, which is NOT what we want here)
 */
container.get('IProjectFactory').getSingletonProject({
    projectRoot: path.resolve(__dirname, paths.project),
    forceTsConfig: false
});
var pathService = container.get('IPathService');
var graphFactory = container.get('IGraphFactory');
var graph = graphFactory.createGraph();
describe('DependencyGraph', function () {
    it('Should be singleton', function () {
        expect(graphFactory.createGraph()).toBe(graph);
    });
    it('Should locate dependencies', function () {
        expect(graph.getDependencies(pathService.createInternal('graph/edge/normal-edge.ts')).length).toBe(1);
        expect(graph.getDependencies(pathService.createInternal('graph/edge/normal-edge.ts'))[0].toString()).toBe('graph/node/normal-node.ts');
    });
    it('Should locate dependents', function () {
        expect(graph.getDependents(pathService.createInternal('graph/edge/normal-edge.ts')).length).toBe(1);
        expect(graph.getDependents(pathService.createInternal('graph/edge/normal-edge.ts'))[0].toString()).toBe('graph/index.ts');
    });
});
