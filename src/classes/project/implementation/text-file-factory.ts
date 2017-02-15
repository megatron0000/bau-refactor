import { IInternalPath } from '../../utils/i-internal-path';
import { ITextFile } from '../i-text-file';
import { ITextFileFactory } from '../i-text-file-factory';
import { TextFile } from './text-file';
import { injectable } from 'inversify';

@injectable()
export class TextFileFactory implements ITextFileFactory {

    public create(config: { content: string; path: IInternalPath }): ITextFile {
        return new TextFile(config.path, config.content);
    }

}
