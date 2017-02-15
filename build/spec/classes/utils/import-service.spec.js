"use strict";
/// <reference types="jasmine" />
var inversify_config_1 = require("../../../src/inversify.config");
var container = new inversify_config_1.ContainerBuilder().build();
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
