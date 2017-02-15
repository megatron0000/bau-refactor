/// <reference types="jasmine" />
import { ContainerBuilder } from '../../../src/inversify.config';
import { IPathService } from '../../../src/classes/utils/i-path-service';
import { IGraphFactory } from '../../../src/classes/graph/i-graph-factory';
import { IProjectFactory } from '../../../src/classes/project/i-project-factory';
import path = require('path');

let paths = {
    project: '../../mock-project'
};

let container = new ContainerBuilder().build();

/**
 * We create a project (singleton) so that DependencyGraph will
 * be created on top of it (otherwise, graph would create a default
 * project - with root at cwd, which is NOT what we want here)
 */
container.get<IProjectFactory>('IProjectFactory').getSingletonProject({
    projectRoot: path.resolve(__dirname, paths.project),
    forceTsConfig: false
});

let pathService = container.get<IPathService>('IPathService');

let graphFactory = container.get<IGraphFactory>('IGraphFactory');
let graph = graphFactory.createGraph();


describe('DependencyGraph', () => {
    it('Should be singleton', () => {
        expect(graphFactory.createGraph()).toBe(graph);
    });

    it('Should locate dependencies', () => {
        expect(graph.getDependencies(pathService.createInternal('graph/edge/normal-edge.ts')).length).toBe(1);
        expect(graph.getDependencies(
            pathService.createInternal('graph/edge/normal-edge.ts')
        )[0].toString()).toBe('graph/node/normal-node.ts');
    });

    it('Should locate dependents', () => {
        expect(graph.getDependents(pathService.createInternal('graph/edge/normal-edge.ts')).length).toBe(1);
        expect(graph.getDependents(
            pathService.createInternal('graph/edge/normal-edge.ts')
        )[0].toString()).toBe('graph/index.ts');
    });
});
