import { IAbsolutePath } from '../utils/i-absolute-path';
import { IInternalPath } from '../utils/i-internal-path';
import { ILinedImport } from './i-lined-import';
import { ITextFile } from './i-text-file';
export interface ISourceFile {
    getRelativeImports(): ILinedImport[];
    toTextFile(): ITextFile;
    getAbsPath(): IAbsolutePath;
    getProjectRelativePath(): IInternalPath;
    getAbsDir(): IAbsolutePath;
    getProjectRelativeDir(): IInternalPath;
}
