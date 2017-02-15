import { IInternalPath } from '../utils/i-internal-path';
import { IAbsolutePath } from '../utils/i-absolute-path';
import { ILinedImport } from './i-lined-import';
export interface ISourceFile {
    getRelativeImports(): ILinedImport[];
    getAbsPath(): IAbsolutePath;
    getProjectRelativePath(): IInternalPath;
    getAbsDir(): IAbsolutePath;
    getProjectRelativeDir(): IInternalPath;
}
