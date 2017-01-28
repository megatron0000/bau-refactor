import { BauNodeSet } from './bau-node-set';

/**
 * A BauEdge is a connection between two BauNodes.
 * 
 * 'from' and 'to' are the 'id's of the BauNodes involved.
 */
interface BauEdge {
    from: number;
    to: number;
}

export class BauEdgeSet {

    protected edgeArray: BauEdge[] = [];


    constructor(nodeSet: BauNodeSet) {
        try {
            /**
             * Add an edge for each node-dependency pair from 'nodeSet'
             */
            nodeSet.forEach(node => {
                node.dependencies.forEach(dependencyLabel => {
                    this.edgeArray.push({
                        from: node.id,
                        to: nodeSet.byLabel(dependencyLabel).id
                    });
                });
            });
        } catch (e) {
            throw new Error(
                `While trying to build a BauEdgeSet, the following happened:
                ${e.message}`
            );
        }
    }

    /**
     * Weaker representation.
     * 
     * The array is a clone (does NOT hold same object references)
     */
    public asArray() {
        return JSON.parse(JSON.stringify(this.edgeArray));
    }


}
