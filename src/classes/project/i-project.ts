import { ISourceFile } from './i-source-file';
export interface IProject {
    getSources(): ISourceFile[];
    pathToSource(fileName: string): ISourceFile;
    getAbsPath(): string;
}
