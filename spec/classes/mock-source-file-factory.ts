import { ILinedImport } from '../../src/classes/project/i-lined-import';
import { IProject } from '../../src/classes/project/i-project';
import { ISourceFile } from '../../src/classes/project/i-source-file';
import { ISourceFileFactory } from '../../src/classes/project/i-source-file-factory';
import { ITextFile } from '../../src/classes/project/i-text-file';
import { IAbsolutePath } from 'strong-paths';
import { IInternalPath } from 'strong-paths';
import { IPathService } from 'strong-paths';
import { inject, injectable } from 'inversify';

class MockSourceFile implements ISourceFile {
    constructor(
        protected source: ts.SourceFile,
        protected parent: IProject,
        protected pathService: IPathService
    ) { }

    public getRelativeImports(): ILinedImport[] {
        throw new Error('Not implemented yet.');
    }

    public toTextFile(): ITextFile {
        throw new Error('Not implemented yet.');
    }

    public getAbsPath(): IAbsolutePath {
        return this.parent
            .getAbsPath()
            .toInternal()
            .join(this.source.fileName)
            .toAbsolute();
    }

    public getProjectRelativePath(): IInternalPath {
        return this.getAbsPath().toInternal();
    }

    public getAbsDir(): IAbsolutePath {
        throw new Error('Not implemented yet.');
    }

    public getProjectRelativeDir(): IInternalPath {
        throw new Error('Not implemented yet.');
    }
}

@injectable()
export class MockSourceFileFactory implements ISourceFileFactory {

    constructor(
        @inject('IPathService') protected pathService: IPathService
    ) { }

    public create(source: ts.SourceFile, parentProject: IProject): ISourceFile {
        return new MockSourceFile(source, parentProject, this.pathService);
    }
}
