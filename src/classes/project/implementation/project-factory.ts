import { IProject } from '../i-project';
import { IProjectFactory } from '../i-project-factory';
import { ISourceFileFactory } from '../i-source-file-factory';
import { Project } from './project';
import { inject } from 'inversify';
import { injectable } from 'inversify';

@injectable()
export class ProjectFactory implements IProjectFactory {

    protected singletonInstance: IProject = null;

    public getSingletonProject(
        config: {
            projectRoot: string;
            forceTsConfig: boolean;
        } = {
                projectRoot: process.cwd(),
                forceTsConfig: true
            }
    ): IProject {
        this.singletonInstance ? null : this.singletonInstance = new Project(this.sourceFactory, config.projectRoot, config.forceTsConfig);
        return this.singletonInstance;
    }

    constructor(
        @inject('ISourceFileFactory') protected sourceFactory: ISourceFileFactory
    ) { }
}
