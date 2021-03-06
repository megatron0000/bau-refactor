"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_config_1 = require("../../../src/inversify.config");
var mock_project_factory_1 = require("../mock-project-factory");
var fs = require("fs-extra");
var path = require("path");
/// <reference types="jasmine" />
var paths = {
    project: '../../mock-project',
    file: 'graph-user.ts'
};
var container = new inversify_config_1.ContainerBuilder().build();
container.unbind('IProjectFactory');
container.bind('IProjectFactory').to(mock_project_factory_1.MockProjectFactory).inSingletonScope();
var sourceFactory = container.get('ISourceFileFactory');
var project = container.get('IProjectFactory').getSingletonProject({
    forceTsConfig: false,
    projectRoot: path.resolve(__dirname, paths.project)
});
var file = ts.createSourceFile(path.resolve(__dirname, paths.project, paths.file), fs.readFileSync(path.resolve(__dirname, paths.project, paths.file), 'utf8'), ts.ScriptTarget.ES5, true);
var source = sourceFactory.create(file, project);
/**
 * Consider yourself inside mock-project/ for all paths below
 */
describe('SourceFile', function () {
    describe('Locations in file-system', function () {
        it('Should know its absolute path', function () {
            expect(path.relative(source.getAbsPath().toString(), path.resolve(__dirname, paths.project, paths.file))).toBeFalsy();
        });
        it('Should know its absolute dir', function () {
            expect(path.relative(source.getAbsDir().toString(), path.join(__dirname, paths.project))).toBeFalsy();
        });
        it('Should know its project-relative path', function () {
            expect(path.relative(source.getProjectRelativePath().toString(), 'graph-user.ts')).toBeFalsy();
        });
        it('Should know its project-relative dir', function () {
            expect(path.relative(source.getProjectRelativeDir().toString(), '.')).toBeFalsy();
        });
    });
    describe('Import Resolution', function () {
        it('Should identify lines of imports', function () {
            expect(source.getRelativeImports()[0].line).toBe(0);
            expect(source.getRelativeImports()[1].line).toBe(1);
        });
        it('Should identify first and last column number of an import literal (avoid the commas)', function () {
            var firstImport = source.getRelativeImports()[0];
            var secondImport = source.getRelativeImports()[1];
            expect(firstImport.startCol).toBe(29);
            expect(firstImport.endCol).toBe(35);
            expect(secondImport.startCol).toBe(28);
            expect(secondImport.endCol).toBe(33);
        });
        it('Should remember the "unresolved" paths', function () {
            expect(source.getRelativeImports()[0].unresolved).toBe('./graph');
            expect(source.getRelativeImports()[1].unresolved).toBe('./user');
        });
        it('Should resolve, detecting "main" and "index" when applicable', function () {
            expect(source.getRelativeImports()[0].resolved.toString()).toBe('graph/index.ts');
            expect(source.getRelativeImports()[1].resolved.toString()).toBe('user/normal-user.ts');
        });
    });
    describe('TextFile conversion', function () {
        it('Should convert to ITextFile', function () {
            expect(source.toTextFile().getContent()).toBe(fs.readFileSync(path.resolve(__dirname, paths.project, paths.file), 'utf8'));
        });
    });
});
