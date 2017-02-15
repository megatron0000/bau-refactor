import { IAbsolutePath } from '../i-absolute-path';
import { IInternalPath } from '../i-internal-path';
import { IPathService } from '../i-path-service';
import path = require('path');
export class InternalPath implements IInternalPath {

    /**
     * Responsibility of IPathService is to
     * provide 'stringRepresentation' already in
     * POSIX format
     */
    constructor(
        protected readonly stringRepresentation: string,
        protected projectRoot: string,
        protected pathService: IPathService
    ) { }

    public equals(other: IInternalPath): boolean {
        return !path.relative(
            this.toString(),
            other.toString()
        );
    }

    public toAbsolute(): IAbsolutePath {
        return this.pathService.createAbsolute(path.join(this.projectRoot, this.toString()));
    }

    public toString(): string {
        return this.stringRepresentation;
    }

    public join(...other: string[]): IInternalPath {
        return this.pathService.createInternal(
            path.join(
                this.toString(),
                ...other
            )
        );
    }
}
