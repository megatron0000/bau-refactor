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
 */
container.get('IProjectFactory').getSingletonProject({
    forceTsConfig: false,
    projectRoot: path.resolve(__dirname, '../../mock-project')
});
var pathService = container.get('IPathService');
describe('AbsolutePath', function () {
    it('Should not allow paths from outside the project', function () {
        var exception = null;
        try {
            pathService.createAbsolute(path.resolve(__dirname, 'some-file-outside-project.ts'));
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should not allow itself to be created from a relative path', function () {
        var exception = null;
        try {
            pathService.createAbsolute('some-file.ts');
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should convert to InternalPath', function () {
        expect(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/some-file.ts')).toInternal().toString()).toBe('some-file.ts');
    });
    it('Should compare if two paths are equal', function () {
        expect(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/some-file.ts')).equals(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/another-file.ts')))).toBe(false);
        expect(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/some-file.ts')).equals(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project/../mock-project/./some-file.ts')))).toBe(true);
    });
    it('Should convert back to string', function () {
        expect(pathService.createAbsolute(path.resolve(__dirname, '../../mock-project')).toString()).toBe(path.resolve(__dirname, '../../mock-project'));
    });
});
