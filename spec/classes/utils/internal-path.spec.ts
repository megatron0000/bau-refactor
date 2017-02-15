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
 * (otherwise, pathService would call projectFactory.getSingletonProject()
 * without arguments, creating project on cwd by default)
 */
container.get<IProjectFactory>('IProjectFactory').getSingletonProject({
    forceTsConfig: false,
    projectRoot: path.resolve(__dirname, '../../mock-project')
});

let pathService = container.get<IPathService>('IPathService');

describe('InternalPath', () => {
    it('Should not allow paths from outside the project', () => {
        let exception: Error = null;
        try {
            pathService.createInternal('../package/sub/file.ts');
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should allow itself to be created from an absolute path', () => {
        let exception: Error = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file.ts'));
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
        exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/some-file.ts'));
        } catch (e) {
            exception = e;
        }
        expect(exception).toBe(null);
    });

    it('Should store POSIX-like string, regardless of OS', () => {
        expect(pathService.createInternal('src\\package\\file.ts').toString())
            .toBe('src/package/file.ts');
    });

    it('Should convert to AbsolutePath', () => {
        expect(
            pathService.createInternal(
                'some-file.ts'
            ).toAbsolute().toString()
        ).toBe(path.resolve(__dirname, '../../mock-project/some-file.ts'));
    });

    it('Should compare if two paths are equal', () => {
        expect(
            pathService.createInternal(
                'package/sub/some-file.ts'
            ).equals(pathService.createInternal('package/sub/another-file.ts'))
        ).toBe(false);

        expect(
            pathService.createInternal(
                '././some-file.ts'
            ).equals(pathService.createInternal('some-file.ts'))
        ).toBe(true);
    });

    it('Should convert back to string', () => {
        expect(
            pathService.createInternal(
                'package/./some-file.d.ts'
            ).toString()
        ).toBe('package/some-file.d.ts');
    });
});
