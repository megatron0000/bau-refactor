"use strict";
var inversify_config_1 = require("../../../src/inversify.config");
var mock_project_factory_1 = require("../mock-project-factory");
var path = require("path");
/// <reference types="jasmine" />
var container = new inversify_config_1.ContainerBuilder().build();
/**
 * We only need the project´s absolute path
 */
container.unbind('IProjectFactory');
container.bind('IProjectFactory').to(mock_project_factory_1.MockProjectFactory);
/**
 * Initialize a project in mock-project/ directory
 * (otherwise, pathService would call projectFactory.getSingletonProject()
 * without arguments, creating project on cwd by default)
 */
container.get('IProjectFactory').getSingletonProject({
    forceTsConfig: false,
    projectRoot: path.resolve(__dirname, '../../mock-project')
});
var pathService = container.get('IPathService');
describe('InternalPath', function () {
    it('Should not allow paths from outside the project', function () {
        var exception = null;
        try {
            pathService.createInternal('../package/sub/file.ts');
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should allow itself to be created from an absolute path', function () {
        var exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file.ts'));
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
        exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/some-file.ts'));
        }
        catch (e) {
            exception = e;
        }
        expect(exception).toBe(null);
    });
    it('Should store POSIX-like string, regardless of OS', function () {
        expect(pathService.createInternal('src\\package\\file.ts').toString())
            .toBe('src/package/file.ts');
    });
    it('Should convert to AbsolutePath', function () {
        expect(pathService.createInternal('some-file.ts').toAbsolute().toString()).toBe(path.resolve(__dirname, '../../mock-project/some-file.ts'));
    });
    it('Should compare if two paths are equal', function () {
        expect(pathService.createInternal('package/sub/some-file.ts').equals(pathService.createInternal('package/sub/another-file.ts'))).toBe(false);
        expect(pathService.createInternal('././some-file.ts').equals(pathService.createInternal('some-file.ts'))).toBe(true);
    });
    it('Should convert back to string', function () {
        expect(pathService.createInternal('package/./some-file.d.ts').toString()).toBe('package/some-file.d.ts');
    });
});
