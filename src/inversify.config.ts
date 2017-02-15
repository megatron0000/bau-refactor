import 'reflect-metadata';
import { IGraphFactory } from './classes/graph/i-graph-factory';
import { GraphFactory } from './classes/graph/implementation/graph-factory';
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
import { IAbsolutePath } from './classes/utils/i-absolute-path';
import { IImportService } from './classes/utils/i-import-service';
import { IInternalPath } from './classes/utils/i-internal-path';
import { IPathService } from './classes/utils/i-path-service';
import { AbsolutePath } from './classes/utils/implementation/absolute-path';
import { ImportService } from './classes/utils/implementation/import-service';
import { InternalPath } from './classes/utils/implementation/internal-path';
import { PathService } from './classes/utils/implementation/path-service';
import { Container } from 'inversify';

export class ContainerBuilder {
    public build(): Container {
        let container = new Container();

        /**
         * graph/
         */
        container.bind<IEdgeFactory>('IEdgeFactory').to(EdgeFactory);
        container.bind<INodeFactory>('INodeFactory').to(NodeFactory);
        container.bind<IGraphFactory>('IGraphFactory').to(GraphFactory);
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
        container.bind<IPathService>('IPathService').to(PathService);
        container.bind<IInternalPath>('IInternalPath').to(InternalPath);
        container.bind<IAbsolutePath>('IAbsolutePath').to(AbsolutePath);

        return container;
    }
}

