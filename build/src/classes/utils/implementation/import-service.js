"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var path = require("path");
var inversify_1 = require("inversify");
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
        var literal = path.relative(path.dirname(importerPath.toString()), importedPath.toString()).replace(/\\/g, '/');
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
ImportService = __decorate([
    inversify_1.injectable()
], ImportService);
exports.ImportService = ImportService;
