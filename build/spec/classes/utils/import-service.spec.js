"use strict";
var inversify_config_1 = require("../../../src/inversify.config");
/// <reference types="jasmine" />
var container = new inversify_config_1.ContainerBuilder().build();
/**
 * PathService can only be created after a project
 */
container.get('IProjectFactory').getSingletonProject();
var importService = container.get('IImportService');
var pathService = container.get('IPathService');
describe('ImportService', function () {
    it('Should build an import literal, from a file to another file', function () {
        expect(importService.buildLiteral(pathService.createInternal('src/mock/some-file.ts'), pathService.createInternal('src/package/subpackage/other.ts')))
            .toBe('../package/subpackage/other');
        expect(importService.buildLiteral(pathService.createInternal('src/mock/some-file.ts'), pathService.createInternal('src/package/subpackage/other.d.ts')))
            .toBe('../package/subpackage/other');
        expect(importService.buildLiteral(pathService.createInternal('src/mock/some-file.ts'), pathService.createInternal('src/package/subpackage/other.tsx')))
            .toBe('../package/subpackage/other');
    });
});
