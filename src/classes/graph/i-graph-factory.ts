import { IDependencyGraph } from './i-dependency-graph';
export interface IGraphFactory {
    createGraph(): IDependencyGraph;
}
