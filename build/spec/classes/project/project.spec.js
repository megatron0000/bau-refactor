"use strict";
var inversify_config_1 = require("../../../src/inversify.config");
var mock_source_file_factory_1 = require("../mock-source-file-factory");
var path = require("path");
/// <reference types="jasmine" />
var container = new inversify_config_1.ContainerBuilder().build();
container.unbind('ISourceFileFactory');
container.bind('ISourceFileFactory').to(mock_source_file_factory_1.MockSourceFileFactory);
describe('Project', function () {
    var paths = {
        project: '../../mock-project',
        files: [
            'graph/edge/normal-edge.ts',
            'graph/node/normal-node.ts',
            'graph/index.ts',
            'user/normal-user.ts',
            'graph-user.ts'
        ]
    };
    var projectFactory = container.get('IProjectFactory');
    var project = projectFactory.getSingletonProject({
        forceTsConfig: false,
        projectRoot: path.resolve(__dirname, paths.project)
    });
    var pathService = container.get('IPathService');
    it('Should be singleton', function () {
        expect(projectFactory.getSingletonProject()).toBe(project);
    });
    it('Should know its path', function () {
        expect(path.relative(project.getAbsPath().toString(), path.resolve(__dirname, paths.project))).toBeFalsy();
    });
    it('Should find all .ts / .tsx / .d.ts files inside', function () {
        expect(project.getSources().length).toBeGreaterThan(0);
        project.getSources().map(function (source) { return source.getAbsPath(); }).forEach(function (source) {
            expect(paths.files.map(function (file) { return path.resolve(__dirname, paths.project, file); })
                .find(function (file) { return !path.relative(file, source.toString()); })).toBeTruthy();
        });
    });
    it('Should map project-relative paths to SourceFiles', function () {
        paths.files.forEach(function (file) {
            expect(project.pathToSource(pathService.createInternal(file))).toBeTruthy();
        });
    });
});
