"use strict";
var path = require("path");
var BauImportService = (function () {
    function BauImportService() {
    }
    /**
     * All paths supplied must be absolute
     */
    BauImportService.prototype.buildLiteral = function (importerPath, importedPath) {
        /**
         * After fs, convert to POSIX
         */
        var literal = path.relative(path.dirname(importerPath), importedPath).replace(/\\/, '/');
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
        return literal.replace(/\\/, '/');
    };
    return BauImportService;
}());
exports.BauImportService = BauImportService;
