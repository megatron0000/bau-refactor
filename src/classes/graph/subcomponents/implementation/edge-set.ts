import { IEdge } from '../i-edge';
import { INodeSet } from '../i-node-set';


export class EdgeSet {

    protected edgeArray: IEdge[] = [];


    constructor(nodeSet: INodeSet) {
        try {
            /**
             * Add an edge for each node-dependency pair from 'nodeSet'
             */
            nodeSet.asArray().forEach(node => {
                node.dependencies.forEach(dependencyLabel => {
                    this.edgeArray.push({
                        from: node.id,
                        to: nodeSet.byLabel(dependencyLabel).id
                    });
                });
            });
        } catch (e) {
            throw new Error(
                `While trying to build a EdgeSet, the following happened:
                ${e.message}`
            );
        }
    }

    /**
     * Weaker representation.
     * 
     * The array is a clone (does NOT hold same object references)
     */
    public asArray(): IEdge[] {
        return JSON.parse(JSON.stringify(this.edgeArray));
    }


}
