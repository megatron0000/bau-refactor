import { IProject } from './i-project';
export interface IProjectFactory {
    getSingletonProject(): IProject;
}
