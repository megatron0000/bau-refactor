import { IProject } from './i-project';
export interface IProjectFactory {
    getSingletonProject(config?: {
        projectRoot: string;
        forceTsConfig: boolean;
    }): IProject;
}
