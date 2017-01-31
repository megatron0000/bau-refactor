import path = require('path');

export class BauImportService {

    /**
     * All paths supplied must be absolute
     */
    public buildLiteral(importerPath: string, importedPath: string): string {
        /**
         * After fs, convert to POSIX
         */
        let literal = path.relative(path.dirname(importerPath), importedPath).replace(/\\/g, '/');
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
