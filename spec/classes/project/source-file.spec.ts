import { ContainerBuilder } from '../../../src/inversify.config';
import { IProjectFactory } from '../../../src/classes/project/i-project-factory';
import { ISourceFileFactory } from '../../../src/classes/project/i-source-file-factory';
import { MockProjectFactory } from '../mock-project-factory';
import fs = require('fs-extra');
import path = require('path');
/// <reference types="jasmine" />


let paths = {
    project: '../../mock-project',
    file: 'graph-user.ts'
};

let container = new ContainerBuilder().build();

container.unbind('IProjectFactory');
container.bind<IProjectFactory>('IProjectFactory').to(MockProjectFactory).inSingletonScope();

let sourceFactory = container.get<ISourceFileFactory>('ISourceFileFactory');

let project = container.get<IProjectFactory>('IProjectFactory').getSingletonProject({
    forceTsConfig: false,
    projectRoot: path.resolve(__dirname, paths.project)
});


let file = ts.createSourceFile(
    path.resolve(__dirname, paths.project, paths.file),
    fs.readFileSync(path.resolve(__dirname, paths.project, paths.file), 'utf8'),
    ts.ScriptTarget.ES5,
    true
);

let source = sourceFactory.create(file, project);

/**
 * Consider yourself inside mock-project/ for all paths below
 */
describe('SourceFile', () => {



    describe('Locations in file-system', () => {
        it('Should know its absolute path', () => {
            expect(path.relative(
                source.getAbsPath().toString(),
                path.resolve(__dirname, paths.project, paths.file)
            )).toBeFalsy();
        });

        it('Should know its absolute dir', () => {
            expect(path.relative(
                source.getAbsDir().toString(),
                path.join(__dirname, paths.project)
            )).toBeFalsy();
        });

        it('Should know its project-relative path', () => {
            expect(path.relative(
                source.getProjectRelativePath().toString(),
                'graph-user.ts'
            )).toBeFalsy();
        });

        it('Should know its project-relative dir', () => {
            expect(path.relative(
                source.getProjectRelativeDir().toString(),
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
            expect(source.getRelativeImports()[0].resolved.toString()).toBe('graph/index.ts');
            expect(source.getRelativeImports()[1].resolved.toString()).toBe('user/normal-user.ts');
        });
    });
});
