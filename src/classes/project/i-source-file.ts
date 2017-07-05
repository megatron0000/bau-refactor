import { IAbsolutePath } from 'strong-paths';
import { IInternalPath } from 'strong-paths';
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
