/**
 * Used only as argument for NodeSet constructor
 * (this means the consumer does not need to care about id numbers,
 * but still must make sure the labels are unique)
 */
export interface IRawNode {
    label: string;
    dependencies: string[];
}
