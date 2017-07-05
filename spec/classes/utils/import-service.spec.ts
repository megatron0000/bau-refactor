import { IProjectFactory } from '../../../src/classes/project/i-project-factory';
import { IImportService } from '../../../src/classes/utils/i-import-service';
import { IPathService } from 'strong-paths';
import { ContainerBuilder } from '../../../src/inversify.config';
/// <reference types="jasmine" />


let container = new ContainerBuilder().build();

/**
 * PathService can only be created after a project
 */
container.get<IProjectFactory>('IProjectFactory').getSingletonProject();

let importService = container.get<IImportService>('IImportService');
let pathService = container.get<IPathService>('IPathService');

describe('ImportService', () => {
    it('Should build an import literal, from a file to another file', () => {
        expect(importService.buildLiteral(
            pathService.createInternal('src/mock/some-file.ts'),
            pathService.createInternal('src/package/subpackage/other.ts'))
        )
            .toBe('../package/subpackage/other');

        expect(importService.buildLiteral(
            pathService.createInternal('src/mock/some-file.ts'),
            pathService.createInternal('src/package/subpackage/other.d.ts'))
        )
            .toBe('../package/subpackage/other');

        expect(importService.buildLiteral(
            pathService.createInternal('src/mock/some-file.ts'),
            pathService.createInternal('src/package/subpackage/other.tsx'))
        )
            .toBe('../package/subpackage/other');
    });
});
