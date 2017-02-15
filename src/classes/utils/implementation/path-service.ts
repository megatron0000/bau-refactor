import { IAbsolutePath } from '../i-absolute-path';
import { IInternalPath } from '../i-internal-path';
import { IPathService } from '../i-path-service';
import { AbsolutePath } from './absolute-path';
import { InternalPath } from './internal-path';
import { injectable } from 'inversify';
import path = require('path');

@injectable()
export class PathService implements IPathService {

    protected static projectRoot: string;

    protected toPosix(filePath: string): string {
        return filePath.replace(/\\/g, '/');
    }

    constructor(
    ) { }

    public init(projectRoot: string): void {
        PathService.projectRoot = projectRoot;
    }

    /**
     * Throws if one attempts to use a path from outside the project.
     * 
     * The only forbidden thing is excessive '../', which means no
     * check is made to verify the paths provided really exist inside
     * the project (they can be yet-inexistent files)
     */
    public createInternal(internalOrAbsolutePath: string): IInternalPath {
        if (!PathService.projectRoot) {
            throw new Error('PathService was not initialized. A IProjectFactory must be instantiated before this service');
        }
        if (
            path.relative(
                PathService.projectRoot,
                path.resolve(PathService.projectRoot, internalOrAbsolutePath)
            ).match(/^(\.\.(\/|\\))/)
        ) {
            throw new Error('Attempted to create InternalPath referencing outside the project.');
        }

        if (path.isAbsolute(internalOrAbsolutePath)) {
            internalOrAbsolutePath = path.relative(
                PathService.projectRoot,
                internalOrAbsolutePath
            );
        }

        // Convert to POSIX
        return new InternalPath(this.toPosix(path.normalize(internalOrAbsolutePath)), PathService.projectRoot, this);
    }

    public createAbsolute(absolutePath: string): IAbsolutePath {
        if (!PathService.projectRoot) {
            throw new Error('PathService was not initialized. A IProjectFactory must be instantiated before this service');
        }
        if (path.relative(
            PathService.projectRoot,
            absolutePath
        ).match(/^(\.\.(\/|\\))/)) {
            throw new Error('Attempted to create AbsolutePath referencing outside the project.');
        } else if (!path.isAbsolute(absolutePath)) {
            throw new Error('Attempted to create AbsolutePath using a relative path');
        }

        return new AbsolutePath(path.normalize(absolutePath), PathService.projectRoot, this);
    }
}
