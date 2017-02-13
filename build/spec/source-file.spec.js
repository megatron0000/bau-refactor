"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var inversify_config_1 = require("../src/inversify.config");
var inversify_1 = require("inversify");
var fs = require("fs-extra");
var path = require("path");
/// <reference types="jasmine" />
/**
 * Fill container with mock IProject.
 *
 * Reasoning is that SourceFile uses only IProject#getAbsPath()
 */
var MockProjectFactory = (function () {
    function MockProjectFactory() {
    }
    MockProjectFactory.prototype.getSingletonProject = function (config) {
        return {
            getAbsPath: function () { return path.resolve(__dirname, 'mock-project'); },
            getSources: function () { return null; },
            pathToSource: function () { return null; }
        };
    };
    return MockProjectFactory;
}());
MockProjectFactory = __decorate([
    inversify_1.injectable()
], MockProjectFactory);
inversify_config_1.container.unbind('IProjectFactory');
inversify_config_1.container.bind('IProjectFactory').to(MockProjectFactory);
/**
 * Consider yourself inside mock-project/ for all paths below
 */
describe('SourceFile', function () {
    var sourceFactory = inversify_config_1.container.get('ISourceFileFactory');
    var paths = {
        project: 'mock-project',
        file: 'graph-user.ts'
    };
    var project = inversify_config_1.container.get('IProjectFactory').getSingletonProject({
        projectRoot: path.resolve(__dirname, paths.project),
        forceTsConfig: false
    });
    var file = ts.createSourceFile(path.resolve(__dirname, paths.project, paths.file), fs.readFileSync(path.resolve(__dirname, paths.project, paths.file), 'utf8'), ts.ScriptTarget.ES5);
    var source = sourceFactory.create(file, project);
    describe('Locations in file-system', function () {
        it('Should know its absolute path', function () {
            expect(path.relative(source.getAbsPath(), path.resolve(__dirname, paths.project, paths.file))).toBeFalsy();
        });
        it('Should know its absolute dir', function () {
            expect(path.relative(source.getAbsDir(), path.join(__dirname, paths.project))).toBeFalsy();
        });
        it('Should know its project-relative path', function () {
            expect(path.relative(source.getProjectRelativePath(), paths.file)).toBeFalsy();
        });
        it('Should know its project-relative dir', function () {
            expect(path.relative(source.getProjectRelativeDir(), '.')).toBeFalsy();
        });
    });
    describe('Import Resolution', function () {
        it('Should identify lines of imports', function () {
            expect(source.getRelativeImports()[0].line).toBe(0);
            expect(source.getRelativeImports()[1].line).toBe(1);
        });
        it('Should remember the "unresolved" paths', function () {
            expect(source.getRelativeImports()[0].unresolved).toBe('./graph');
            expect(source.getRelativeImports()[1].unresolved).toBe('./user');
        });
        it('Should resolve, detecting "main" and "index" when applicable', function () {
            expect(source.getRelativeImports()[0].path).toBe('./graph/index.ts');
            expect(source.getRelativeImports()[1].path).toBe('./user/normal-user.ts');
        });
    });
});
