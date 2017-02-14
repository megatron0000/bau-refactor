import { ContainerBuilder } from '../../../src/inversify.config';
import { IProjectFactory } from '../../../src/classes/project/i-project-factory';
import { ISourceFileFactory } from '../../../src/classes/project/i-source-file-factory';
import { MockSourceFileFactory } from '../mock-source-file-factory';
import path = require('path');
/// <reference types="jasmine" />

let container = new ContainerBuilder().build();

container.unbind('ISourceFileFactory');
container.bind<ISourceFileFactory>('ISourceFileFactory').to(MockSourceFileFactory);

describe('Project', () => {
    let paths = {
        project: '../../mock-project',
        files: [
            'graph/edge/normal-edge.ts',
            'graph/node/normal-node.ts',
            'graph/index.ts',
            'user/normal-user.ts',
            'graph-user.ts'
        ]
    };

    let projectFactory = container.get<IProjectFactory>('IProjectFactory');

    let project = projectFactory.getSingletonProject({
        forceTsConfig: false,
        projectRoot: path.resolve(__dirname, paths.project)
    });

    it('Should be singleton', () => {
        expect(projectFactory.getSingletonProject()).toBe(project);
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
