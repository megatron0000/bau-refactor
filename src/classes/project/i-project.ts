import { IAbsolutePath } from 'strong-paths';
import { IInternalPath } from 'strong-paths';
import { ISourceFile } from './i-source-file';
export interface IProject {
    getSources(): ISourceFile[];
    pathToSource(filePath: IInternalPath): ISourceFile;
    getAbsPath(): IAbsolutePath;
}
