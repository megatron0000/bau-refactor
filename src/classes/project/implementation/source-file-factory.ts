import { IPathService } from 'strong-paths';
import { IProject } from '../i-project';
import { ISourceFileFactory } from '../i-source-file-factory';
import { ITextFileFactory } from '../i-text-file-factory';
import { SourceFile } from './source-file';
import { inject, injectable } from 'inversify';

@injectable()
export class SourceFileFactory implements ISourceFileFactory {

    constructor(
        @inject('IPathService') protected pathService: IPathService,
        @inject('ITextFileFactory') protected textFileFactory: ITextFileFactory
    ) { }

    public create(source: ts.SourceFile, parentProject: IProject) {
        return new SourceFile(source, parentProject, this.pathService, this.textFileFactory);
    }

}
