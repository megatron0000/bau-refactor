import { IEdgeSet } from '../i-edge-set';
import { INodeSet } from '../i-node-set';
import { EdgeSet } from './edge-set';
import { IEdgeFactory } from '../i-edge-factory';
import { injectable } from 'inversify';

@injectable()
export class EdgeFactory implements IEdgeFactory {

    public createEdgeSet(nodeSet: INodeSet): IEdgeSet {
        return new EdgeSet(nodeSet);
    }

}
