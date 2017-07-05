import { IInternalPath } from 'strong-paths';
export interface IImportService {
    buildLiteral(importerPath: IInternalPath, importedPath: IInternalPath): string;
}
