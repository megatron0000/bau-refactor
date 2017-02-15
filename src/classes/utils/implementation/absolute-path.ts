import { IAbsolutePath } from '../i-absolute-path';
import { IInternalPath } from '../i-internal-path';
import { IPathService } from '../i-path-service';
import path = require('path');
export class AbsolutePath implements IAbsolutePath {

    constructor(
        protected readonly stringRepresentation: string,
        protected projectRoot: string,
        protected pathService: IPathService
    ) { }

    public equals(other: IAbsolutePath): boolean {
        return !path.relative(
            this.toString(),
            other.toString()
        );
    }

    public toInternal(): IInternalPath {
        return this.pathService.createInternal(path.relative(
            this.projectRoot,
            this.toString()
        ));
    }

    public toString(): string {
        return this.stringRepresentation;
    }
}
