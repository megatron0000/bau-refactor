import { IInternalPath } from 'strong-paths';
import { ITextFile } from './i-text-file';
export interface ITextFileFactory {
    create(config: { content: string; path: IInternalPath}): ITextFile;
}
