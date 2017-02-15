import { IInternalPath } from './i-internal-path';
export interface IImportService {
    buildLiteral(importerPath: IInternalPath, importedPath: IInternalPath): string;
}
