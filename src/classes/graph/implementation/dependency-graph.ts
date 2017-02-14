import { IProject } from '../../project/i-project';
import { IProjectFactory } from '../../project/i-project-factory';
import { IDependencyGraph } from '../i-dependency-graph';
import { IEdgeFactory } from '../subcomponents/i-edge-factory';
import { IEdgeSet } from '../subcomponents/i-edge-set';
import { INodeFactory } from '../subcomponents/i-node-factory';
import { INodeSet } from '../subcomponents/i-node-set';
import path = require('path');


/**
 * Uses POSIX paths for node labels
 * 
 * Any path inputted in methods is converted to POSIX for you
 */
export class DependencyGraph implements IDependencyGraph {

    protected nodeSet: INodeSet;
    protected edgeSet: IEdgeSet;

    /**
     * Uses POSIX paths as node labels
     * 
     * Throws error if any dependency cannot be found
     * in the file system
     */
    protected build(project: IProject): void {
        /**
         * - Make all labels be project-relative paths
         * - Resolve implicit names (like non-written index.ts)
         */
        let nodes = project.getSources().map(source => ({
            // Had forgotten to convert to POSIX here too
            label: source.getProjectRelativePath().replace(/\\/g, '/'),
            dependencies: source.getRelativeImports()
                // do not care about line
                .map(importt => importt.path)
                // convert to root-relative path
                .map(fileRelative => path.join(source.getProjectRelativeDir(), fileRelative))
                // convert to POSIX
                .map(winPath => winPath.replace(/\\/g, '/'))
        }));

        this.nodeSet = this.nodeFactory.createNodeSet(nodes);
        this.edgeSet = this.edgeFactory.createEdgeSet(this.nodeSet);
    }

    /**
     * Throws error if any dependency cannot be found
     * in the file system
     */
    constructor(
        projectFactory: IProjectFactory,
        protected nodeFactory: INodeFactory,
        protected edgeFactory: IEdgeFactory
    ) {
        this.build(projectFactory.getSingletonProject());
    }

    /**
     * Accepts only project-relative fileName
     * 
     * Throws Error if fileName is not part of project
     */
    public getDependents(fileName: string): string[] {
        // Assure path is POSIX
        let id: number = this.nodeSet.byLabel(path.normalize(fileName).replace(/\\/g, '/')).id;
        return this.edgeSet.asArray()
            // Only those that depend on current
            .filter(edge => edge.to === id)
            // From entire edge to only the dependent file´s id
            .map(edge => edge.from)
            // Only the label (project-relative path) of dependent file
            .map(fromId => this.nodeSet.byId(fromId).label);
    }

    /**
     * Accepts only project-relative fileName
     * 
     * Throws Error if fileName is not part of project
     */
    public getDependencies(fileName: string): string[] {
        // Assure path is POSIX
        let id: number = this.nodeSet.byLabel(path.normalize(fileName).replace(/\\/g, '/')).id;
        return this.edgeSet.asArray()
            // Only dependencies of current
            .filter(edge => edge.from === id)
            // From entire edge to only the dependency´s id
            .map(edge => edge.to)
            // Only the label (project-relative path) of dependency
            .map(toId => this.nodeSet.byId(toId).label);
    }


}
