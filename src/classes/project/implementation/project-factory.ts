import { IProject } from '../i-project';
import { IProjectFactory } from '../i-project-factory';
import { ISourceFileFactory } from '../i-source-file-factory';
import { Project } from './project';
import { inject } from 'inversify';
import { injectable } from 'inversify';

@injectable()
export class ProjectFactory implements IProjectFactory {

    protected static singletonInstance: IProject = null;

    public getSingletonProject(
        config: {
            projectRoot: string;
            forceTsConfig: boolean;
        } = {
                projectRoot: process.cwd(),
                forceTsConfig: true
            }
    ): IProject {
        ProjectFactory.singletonInstance ? null :
            ProjectFactory.singletonInstance = new Project(this.sourceFactory, config.projectRoot, config.forceTsConfig);
        return ProjectFactory.singletonInstance;
    }

    constructor(
        @inject('ISourceFileFactory') protected sourceFactory: ISourceFileFactory
    ) { }
}
