"use strict";
var path = require("path");
var ImportService = (function () {
    function ImportService() {
    }
    /**
     * All paths supplied must be absolute
     */
    ImportService.prototype.buildLiteral = function (importerPath, importedPath) {
        /**
         * After fs, convert to POSIX
         */
        var literal = path.relative(path.dirname(importerPath), importedPath).replace(/\\/g, '/');
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
    };
    return ImportService;
}());
exports.ImportService = ImportService;
