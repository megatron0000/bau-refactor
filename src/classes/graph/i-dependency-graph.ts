import { IInternalPath } from '../utils/i-internal-path';
export interface IDependencyGraph {
    getDependents(filePath: IInternalPath): IInternalPath[];
    getDependencies(filePath: IInternalPath): IInternalPath[];
}
