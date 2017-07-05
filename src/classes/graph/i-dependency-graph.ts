import { IInternalPath } from 'strong-paths';
export interface IDependencyGraph {
    getDependents(filePath: IInternalPath): IInternalPath[];
    getDependencies(filePath: IInternalPath): IInternalPath[];
}
