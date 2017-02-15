import { IPathService } from '../../utils/i-path-service';
import { IProject } from '../i-project';
import { ISourceFileFactory } from '../i-source-file-factory';
import { SourceFile } from './source-file';
import { injectable, inject } from 'inversify';

@injectable()
export class SourceFileFactory implements ISourceFileFactory {

    constructor(
        @inject('IPathService') protected pathService: IPathService
    ) { }

    public create(source: ts.SourceFile, parentProject: IProject) {
        return new SourceFile(source, parentProject, this.pathService);
    }

}
