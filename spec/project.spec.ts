import { ContainerBuilder } from '../src/inversify.config';
import { ILinedImport } from '../src/classes/project/i-lined-import';
import { IProjectFactory } from '../src/classes/project/i-project-factory';
import { injectable } from 'inversify';
import path = require('path');
import { ISourceFile } from '../src/classes/project/i-source-file';
import { IProject } from '../src/classes/project/i-project';
import { ISourceFileFactory } from '../src/classes/project/i-source-file-factory';
/// <reference types="jasmine" />

let container = new ContainerBuilder().build();

class MockSourceFile implements ISourceFile {

    constructor(
        protected source: ts.SourceFile,
        protected parent: IProject
    ) { }

    public getRelativeImports(): ILinedImport[] {
        throw new Error('Not implemented yet.');
    }

    public getAbsPath(): string {
        return path.resolve(this.parent.getAbsPath(), this.source.fileName);
    }

    public getProjectRelativePath(): string {
        throw new Error('Not implemented yet.');
    }

    public getAbsDir(): string {
        throw new Error('Not implemented yet.');
    }

    public getProjectRelativeDir(): string {
        throw new Error('Not implemented yet.');
    }
}

@injectable()
class MockSourceFileFactory implements ISourceFileFactory {
    public create(source: ts.SourceFile, parentProject: IProject): ISourceFile {
        return new MockSourceFile(source, parentProject);
    }
}
container.unbind('ISourceFileFactory');
container.bind<ISourceFileFactory>('ISourceFileFactory').to(MockSourceFileFactory);

describe('Project', () => {
    let paths = {
        project: 'mock-project',
        files: [
            'graph/edge/normal-edge.ts',
            'graph/node/normal-node.ts',
            'graph/index.ts',
            'user/normal-user.ts',
            'graph-user.ts'
        ]
    };

    let project = container.get<IProjectFactory>('IProjectFactory').getSingletonProject({
        forceTsConfig: false,
        projectRoot: path.resolve(__dirname, paths.project)
    });

    it('Should know its path', () => {
        expect(
            path.relative(
                project.getAbsPath(),
                path.resolve(__dirname, paths.project)
            )
        ).toBeFalsy();
    });

    it('Should find all .ts / .tsx / .d.ts files inside', () => {
        expect(project.getSources().length).toBeGreaterThan(0);

        project.getSources().map(source => source.getAbsPath()).forEach(source => {
            expect(
                paths.files.map(file => path.resolve(__dirname, paths.project, file))
                    .find(file => !path.relative(file, source))
            ).toBeTruthy();
        });
    });

    it('Should map project-relative paths to SourceFiles', () => {
        paths.files.forEach(file => {
            expect(project.pathToSource(file)).toBeTruthy();
        });
    });

});
