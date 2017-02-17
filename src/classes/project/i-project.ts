import { IAbsolutePath } from '../utils/i-absolute-path';
import { IInternalPath } from '../utils/i-internal-path';
import { ISourceFile } from './i-source-file';
export interface IProject {
    getSources(): ISourceFile[];
    pathToSource(filePath: IInternalPath): ISourceFile;
    getAbsPath(): IAbsolutePath;
}
