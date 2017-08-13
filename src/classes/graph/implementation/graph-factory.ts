import { IPathService } from 'strong-paths';
import { DependencyGraph } from './dependency-graph';
import { IProjectFactory } from '../../project/i-project-factory';
import { IDependencyGraph } from '../i-dependency-graph';
import { IGraphFactory } from '../i-graph-factory';
import { IEdgeFactory } from '../subcomponents/i-edge-factory';
import { INodeFactory } from '../subcomponents/i-node-factory';
import { inject, injectable } from 'inversify';

@injectable()
// SINGLETON
export class GraphFactory implements IGraphFactory {

    protected graphSingleton: IDependencyGraph = null;

    constructor(
        @inject('IProjectFactory') protected projectFactory: IProjectFactory,
        @inject('INodeFactory') protected nodeFactory: INodeFactory,
        @inject('IEdgeFactory') protected edgeFactory: IEdgeFactory,
        @inject('IPathService') protected pathService: IPathService
    ) { }

    public createGraph(): IDependencyGraph {
        this.graphSingleton = this.graphSingleton || new DependencyGraph(
            this.projectFactory,
            this.nodeFactory,
            this.edgeFactory,
            this.pathService
        );
        return this.graphSingleton;
    }
}
