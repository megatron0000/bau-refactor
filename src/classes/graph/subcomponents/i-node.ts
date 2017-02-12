import { IRawNode } from './i-raw-node';
/**
 * If multiple nodes are to be part of a graph, 'label's must be unique
 * 
 * 'dependencies' is an array of labels
 */
export interface INode extends IRawNode {
    id: number;
}
