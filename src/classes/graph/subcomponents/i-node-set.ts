import { INode } from './i-node';
export interface INodeSet {
    byId(id: Number): INode;
    byLabel(label: string): INode;
    forEach(callback: (node: INode) => any): void;
    asArray(): INode[];
}
