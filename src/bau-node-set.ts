/**
 * Used only as argument for BauNodeSet constructor
 * (this means the consumer does not need to care about id numbers,
 * but still must make sure the labels are unique)
 */
interface RawNode {
    label: string;
    dependencies: string[];
}

/**
 * If multiple nodes are to be part of a graph, 'label's must be unique
 * 
 * 'dependencies' is an array of labels
 */
interface BauNode {
    label: string;
    dependencies: string[];
    id: number;
}

export class BauNodeSet {

    protected idCount = 0;

    /**
     * 'label's and 'id's must be unique
     * 
     * It is not necessary for all declared dependencies to be
     * present inside the array
     */
    protected nodeArray: BauNode[] = [];

    /**
     * See interface BauNode for clarification.
     * 
     * It is not necessary for all dependencies to be present
     * in the array.
     */
    constructor(sourceNodes: RawNode[]) {
        let newNodes = sourceNodes;
        /**
         * Flatten dependencies, without worrying
         * about producing duplication
         */
        sourceNodes.forEach(node => {
            newNodes = newNodes.concat(node.dependencies.map(old => ({ label: old, dependencies: [] })));
        });
        /**
         * Remove duplication.
         * 
         * Observe it is important to maintain the lowest index copy of everycc
         * element, since only these possess the original 'dependencies' array
         */
        let accumulatedLabels: string[] = [];
        newNodes = newNodes.filter(node => {
            if (!accumulatedLabels.find(label => label === node.label)) {
                accumulatedLabels.push(node.label);
                return true;
            }
            return false;
        });
        /**
         * Finally, insert id's
         */
        this.nodeArray = newNodes.map(node => ({
            id: ++this.idCount,
            ...node
        }));
    }

    /**
     * Get a node by its unique id
     * 
     * Throws Error if not present
     */
    public byId(id: number) {
        let found = this.nodeArray.find(node => node.id === id);
        if (!found) {
            throw new Error(`No node with id ${id} exists in this BauNodeSet`);
        }
        return found;
    }

    /**
     * Get a node by its unique label
     * 
     * Throws Error if not present
     */
    public byLabel(label: string) {
        let found = this.nodeArray.find(node => node.label === label);
        if (!found) {
            throw new Error(`No node with label ${label} exists in this BauNodeSet`);
        }
        return found;
    }


    /**
     * Utility to iterate over all nodes of this BauNodeSet instance,
     * since there is no other way to access all them.
     */
    public forEach(callback: (node: BauNode) => any): void {
        this.nodeArray.forEach(callback);
    }

    /**
     * Weaker representation
     * 
     * The array is a clone (does NOT hold same object references)
     */
    public asArray() {
        return JSON.parse(JSON.stringify(this.nodeArray));
    }

}
