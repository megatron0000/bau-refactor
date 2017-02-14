import { ILinedImport } from '../../src/classes/project/i-lined-import';
import { IProject } from '../../src/classes/project/i-project';
import { ISourceFile } from '../../src/classes/project/i-source-file';
import { ISourceFileFactory } from '../../src/classes/project/i-source-file-factory';
import { injectable } from 'inversify';
import path = require('path');

class MockSourceFile implements ISourceFile {
    constructor(
        protected source: ts.SourceFile,
        protected parent: IProject
    ) { }

    public getRelativeImports(): ILinedImport[] {
        throw new Error('Not implemented yet.');
    }

    public getAbsPath(): string {
        return path.resolve(this.parent.getAbsPath(), this.source.fileName);
    }

    public getProjectRelativePath(): string {
        throw new Error('Not implemented yet.');
    }

    public getAbsDir(): string {
        throw new Error('Not implemented yet.');
    }

    public getProjectRelativeDir(): string {
        throw new Error('Not implemented yet.');
    }
}

@injectable()
export class MockSourceFileFactory implements ISourceFileFactory {
    public create(source: ts.SourceFile, parentProject: IProject): ISourceFile {
        return new MockSourceFile(source, parentProject);
    }
}
