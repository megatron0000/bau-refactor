import { IProjectFactory } from '../../../src/classes/project/i-project-factory';
import { IPathService } from '../../../src/classes/utils/i-path-service';
import { ContainerBuilder } from '../../../src/inversify.config';
import { MockProjectFactory } from '../mock-project-factory';
import path = require('path');
/// <reference types="jasmine" />

let container = new ContainerBuilder().build();
/**
 * We only need the project´s absolute path
 */
container.unbind('IProjectFactory');
container.bind<IProjectFactory>('IProjectFactory').to(MockProjectFactory);
/**
 * Initialize a project in mock-project/ directory
 */
container.get<IProjectFactory>('IProjectFactory').getSingletonProject({
    forceTsConfig: false,
    projectRoot: path.resolve(__dirname, '../../mock-project')
});

let pathService = container.get<IPathService>('IPathService');

describe('AbsolutePath', () => {
    it('Should not allow paths from outside the project', () => {
        let exception: Error = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file-outside-project.ts'));
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should not allow itself to be created from a relative path', () => {
        let exception: Error = null;
        try {
            pathService.createAbsolute('some-file.ts');
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should convert to InternalPath', () => {
        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, '../../mock-project/some-file.ts')
            ).toInternal().toString()
        ).toBe('some-file.ts');
    });

    it('Should compare if two paths are equal', () => {
        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, '../../mock-project/some-file.ts')
            ).equals(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/another-file.ts')))
        ).toBe(false);

        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, '../../mock-project/some-file.ts')
            ).equals(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/../mock-project/./some-file.ts')))
        ).toBe(true);
    });

    it('Should convert back to string', () => {
        expect(
            pathService.createAbsolute(
                path.resolve(__dirname, '../../mock-project')
            ).toString()
        ).toBe(path.resolve(__dirname, '../../mock-project'));
    });
});
