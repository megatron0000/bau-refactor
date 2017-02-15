import { IInternalPath } from '../i-internal-path';
import { IImportService } from '../i-import-service';
import path = require('path');
import { injectable } from 'inversify';

@injectable()
export class ImportService implements IImportService {

    /**
     * All paths supplied must be absolute
     */
    public buildLiteral(importerPath: IInternalPath, importedPath: IInternalPath): string {
        /**
         * After fs, convert to POSIX
         */
        let literal = path.relative(path.dirname(importerPath.toString()), importedPath.toString()).replace(/\\/g, '/');
        /**
         * Initiate with './' if no sign of relative path is present yet
         */
        if (!literal.match(/^(\.\/|\.\.\/)/)) {
            literal = './' + literal;
        }
        /**
         * Remove extensions
         */
        literal = literal.replace(/(\.d\.ts)$/, '').replace(/(\.ts)$/, '').replace(/(\.tsx)$/, '');
        /**
         * Avoid windows problems by converting paths to POSIX (ie: forward slashes)
         */
        return literal.replace(/\\/g, '/');
    }
}
