import { IAbsolutePath } from './i-absolute-path';
import { IInternalPath } from './i-internal-path';
export interface IPathService {
    init(projectRoot: string): void;
    createInternal(projectRelativePath: string): IInternalPath;
    createAbsolute(absolutePath: string): IAbsolutePath;
}
