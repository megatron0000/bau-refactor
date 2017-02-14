import { IProject } from '../../src/classes/project/i-project';
import { IProjectFactory } from '../../src/classes/project/i-project-factory';
import { injectable } from 'inversify';
@injectable()
export class MockProjectFactory implements IProjectFactory {

    public getSingletonProject(config: {
        projectRoot: string;
        forceTsConfig: boolean;
    }): IProject {
        return {
            getAbsPath: () => config.projectRoot,
            getSources: () => null,
            pathToSource: () => null
        };
    }
}
