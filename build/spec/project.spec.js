"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var inversify_config_1 = require("../src/inversify.config");
var inversify_1 = require("inversify");
var path = require("path");
/// <reference types="jasmine" />
var container = new inversify_config_1.ContainerBuilder().build();
var MockSourceFile = (function () {
    function MockSourceFile(source, parent) {
        this.source = source;
        this.parent = parent;
    }
    MockSourceFile.prototype.getRelativeImports = function () {
        throw new Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getAbsPath = function () {
        return path.resolve(this.parent.getAbsPath(), this.source.fileName);
    };
    MockSourceFile.prototype.getProjectRelativePath = function () {
        throw new Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getAbsDir = function () {
        throw new Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getProjectRelativeDir = function () {
        throw new Error('Not implemented yet.');
    };
    return MockSourceFile;
}());
var MockSourceFileFactory = (function () {
    function MockSourceFileFactory() {
    }
    MockSourceFileFactory.prototype.create = function (source, parentProject) {
        return new MockSourceFile(source, parentProject);
    };
    return MockSourceFileFactory;
}());
MockSourceFileFactory = __decorate([
    inversify_1.injectable()
], MockSourceFileFactory);
container.unbind('ISourceFileFactory');
container.bind('ISourceFileFactory').to(MockSourceFileFactory);
describe('Project', function () {
    var paths = {
        project: 'mock-project',
        files: [
            'graph/edge/normal-edge.ts',
            'graph/node/normal-node.ts',
            'graph/index.ts',
            'user/normal-user.ts',
            'graph-user.ts'
        ]
    };
    var project = container.get('IProjectFactory').getSingletonProject({
        forceTsConfig: false,
        projectRoot: path.resolve(__dirname, paths.project)
    });
    it('Should know its path', function () {
        expect(path.relative(project.getAbsPath(), path.resolve(__dirname, paths.project))).toBeFalsy();
    });
    it('Should find all .ts / .tsx / .d.ts files inside', function () {
        expect(project.getSources().length).toBeGreaterThan(0);
        project.getSources().map(function (source) { return source.getAbsPath(); }).forEach(function (source) {
            expect(paths.files.map(function (file) { return path.resolve(__dirname, paths.project, file); })
                .find(function (file) { return !path.relative(file, source); })).toBeTruthy();
        });
    });
    it('Should map project-relative paths to SourceFiles', function () {
        paths.files.forEach(function (file) {
            expect(project.pathToSource(file)).toBeTruthy();
        });
    });
});
