/// <reference types="jasmine" />
import { ContainerBuilder } from '../../../src/inversify.config';
import { IImportService } from '../../../src/classes/utils/i-import-service';


let container = new ContainerBuilder().build();
let importService = container.get<IImportService>('IImportService');

describe('ImportService', () => {
    it('Should build an import literal, from a file to another file', () => {
        expect(importService.buildLiteral('src/mock/some-file.ts', 'src/package/subpackage/other.ts'))
            .toBe('../package/subpackage/other');

        expect(importService.buildLiteral('src/mock/some-file.ts', 'src/package/subpackage/other.d.ts'))
            .toBe('../package/subpackage/other');

        expect(importService.buildLiteral('src/mock/some-file.ts', 'src/package/subpackage/other.tsx'))
            .toBe('../package/subpackage/other');
    });
});
