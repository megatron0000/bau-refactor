import 'reflect-metadata';
import { IDependencyGraph } from './classes/graph/i-dependency-graph';
import { DependencyGraph } from './classes/graph/implementation/dependency-graph';
import { IEdgeFactory } from './classes/graph/subcomponents/i-edge-factory';
import { INodeFactory } from './classes/graph/subcomponents/i-node-factory';
import { EdgeFactory } from './classes/graph/subcomponents/implementation/edge-factory';
import { NodeFactory } from './classes/graph/subcomponents/implementation/node-factory';
import { IFileMover } from './classes/mover/i-file-mover';
import { FileMover } from './classes/mover/implementation/file-mover';
import { IProjectFactory } from './classes/project/i-project-factory';
import { ISourceFileFactory } from './classes/project/i-source-file-factory';
import { ProjectFactory } from './classes/project/implementation/project-factory';
import { SourceFileFactory } from './classes/project/implementation/source-file-factory';
import { IImportService } from './classes/utils/i-import-service';
import { ImportService } from './classes/utils/implementation/import-service';
import { Container } from 'inversify';

let container = new Container();

/**
 * graph/
 */
container.bind<IEdgeFactory>('IEdgeFactory').to(EdgeFactory);
container.bind<INodeFactory>('INodeFactory').to(NodeFactory);
container.bind<IDependencyGraph>('IDependencyGraph').to(DependencyGraph);
/**
 * mover/
 */
container.bind<IFileMover>('IFileMover').to(FileMover);
/**
 * project/
 */
container.bind<IProjectFactory>('IProjectFactory').to(ProjectFactory);
container.bind<ISourceFileFactory>('ISourceFileFactory').to(SourceFileFactory);
/**
 * utils/
 */
container.bind<IImportService>('IImportService').to(ImportService);

export { container };