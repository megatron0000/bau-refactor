import { ISourceFile } from './i-source-file';
import { IProject } from './i-project';
export interface ISourceFileFactory {
    create(source: ts.SourceFile, parentProject: IProject): ISourceFile;
}
