import { ContainerBuilder } from '../src/inversify.config';
import { injectable } from 'inversify';
import { IProject } from '../src/classes/project/i-project';
import { IProjectFactory } from '../src/classes/project/i-project-factory';
import { ISourceFileFactory } from '../src/classes/project/i-source-file-factory';
import fs = require('fs-extra');
import path = require('path');
/// <reference types="jasmine" />

let container = new ContainerBuilder().build();

/**
 * Fill container with mock IProject.
 * 
 * Reasoning is that SourceFile uses only IProject#getAbsPath()
 */
@injectable()
class MockProjectFactory implements IProjectFactory {

    public getSingletonProject(config: {
        projectRoot: string;
        forceTsConfig: boolean;
    }): IProject {
        return {
            getAbsPath: () => path.resolve(__dirname, 'mock-project'),
            getSources: () => null,
            pathToSource: () => null
        };
    }
}
container.unbind('IProjectFactory');
container.bind<IProjectFactory>('IProjectFactory').to(MockProjectFactory);

/**
 * Consider yourself inside mock-project/ for all paths below
 */
describe('SourceFile', () => {

    let sourceFactory = container.get<ISourceFileFactory>('ISourceFileFactory');

    let paths = {
        project: 'mock-project',
        file: 'graph-user.ts'
    };

    let project = container.get<IProjectFactory>('IProjectFactory').getSingletonProject(
        {
            projectRoot: path.resolve(__dirname, paths.project),
            forceTsConfig: false
        }
    );

    let file = ts.createSourceFile(
        path.resolve(__dirname, paths.project, paths.file),
        fs.readFileSync(path.resolve(__dirname, paths.project, paths.file), 'utf8'),
        ts.ScriptTarget.ES5
    );

    let source = sourceFactory.create(file, project);

    describe('Locations in file-system', () => {
        it('Should know its absolute path', () => {
            expect(path.relative(
                source.getAbsPath(),
                path.resolve(__dirname, paths.project, paths.file)
            )).toBeFalsy();
        });

        it('Should know its absolute dir', () => {
            expect(path.relative(
                source.getAbsDir(),
                path.join(__dirname, paths.project)
            )).toBeFalsy();
        });

        it('Should know its project-relative path', () => {
            expect(path.relative(
                source.getProjectRelativePath(),
                paths.file
            )).toBeFalsy();
        });

        it('Should know its project-relative dir', () => {
            expect(path.relative(
                source.getProjectRelativeDir(),
                '.'
            )).toBeFalsy();
        });

    });

    describe('Import Resolution', () => {
        it('Should identify lines of imports', () => {
            expect(source.getRelativeImports()[0].line).toBe(0);
            expect(source.getRelativeImports()[1].line).toBe(1);
        });

        it('Should remember the "unresolved" paths', () => {
            expect(source.getRelativeImports()[0].unresolved).toBe('./graph');
            expect(source.getRelativeImports()[1].unresolved).toBe('./user');
        });

        it('Should resolve, detecting "main" and "index" when applicable', () => {
            expect(source.getRelativeImports()[0].path).toBe('./graph/index.ts');
            expect(source.getRelativeImports()[1].path).toBe('./user/normal-user.ts');
        });
    });
});
