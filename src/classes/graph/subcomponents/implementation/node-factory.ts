import { NodeSet } from './node-set';
import { IRawNode } from '../i-raw-node';
import { INodeFactory } from '../i-node-factory';
import { injectable } from 'inversify';
@injectable()
export class NodeFactory implements INodeFactory {
    createNodeSet(sourceNodes: IRawNode[]) {
        return new NodeSet(sourceNodes);
    }
}
