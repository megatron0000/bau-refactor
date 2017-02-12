import { SourceFile } from './source-file';
import { IProject } from '../i-project';
import { ISourceFileFactory } from '../i-source-file-factory';
import { injectable } from 'inversify';

@injectable()
export class SourceFileFactory implements ISourceFileFactory {

    public create(source: ts.SourceFile, parentProject: IProject) {
        return new SourceFile(source, parentProject);
    }

}
