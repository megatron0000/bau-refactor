import { INodeSet } from './i-node-set';
import { IRawNode } from './i-raw-node';
export interface INodeFactory {
    createNodeSet(sourceNodes: IRawNode[]): INodeSet;
}
