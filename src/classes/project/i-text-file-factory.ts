import { IInternalPath } from '../utils/i-internal-path';
import { ITextFile } from './i-text-file';
export interface ITextFileFactory {
    create(config: { content: string; path: IInternalPath}): ITextFile;
}
