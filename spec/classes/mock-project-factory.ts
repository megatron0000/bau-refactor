import { IPathService } from '../../src/classes/utils/i-path-service';
import { IProject } from '../../src/classes/project/i-project';
import { IProjectFactory } from '../../src/classes/project/i-project-factory';
import { injectable, inject } from 'inversify';
@injectable()
export class MockProjectFactory implements IProjectFactory {

    protected static singletonProject: IProject = null;

    constructor(
        @inject('IPathService') protected pathService: IPathService
    ) { }

    public getSingletonProject(config: {
        projectRoot: string;
        forceTsConfig: boolean;
    } = {
            projectRoot: process.cwd(),
            forceTsConfig: true
        }): IProject {

        if (!MockProjectFactory.singletonProject) {
            this.pathService.init(config.projectRoot);
            MockProjectFactory.singletonProject = {
                getAbsPath: () => this.pathService.createAbsolute(config.projectRoot),
                getSources: () => null,
                pathToSource: () => null
            };
        }
        return MockProjectFactory.singletonProject;
    }
}
