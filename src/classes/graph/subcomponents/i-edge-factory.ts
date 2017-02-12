import { IEdgeSet } from './i-edge-set';
import { INodeSet } from './i-node-set';
export interface IEdgeFactory {
    createEdgeSet(nodeSet: INodeSet): IEdgeSet;
}
