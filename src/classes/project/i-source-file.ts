import { ILinedImport } from './i-lined-import';
export interface ISourceFile {
    getRelativeImports(): ILinedImport[];
    getAbsPath(): string;
    getProjectRelativePath(): string;
    getAbsDir(): string;
    getProjectRelativeDir(): string;
}
