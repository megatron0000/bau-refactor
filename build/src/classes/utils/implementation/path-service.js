"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var absolute_path_1 = require("./absolute-path");
var internal_path_1 = require("./internal-path");
var inversify_1 = require("inversify");
var path = require("path");
var PathService = PathService_1 = (function () {
    function PathService() {
    }
    PathService.prototype.toPosix = function (filePath) {
        return filePath.replace(/\\/g, '/');
    };
    PathService.prototype.init = function (projectRoot) {
        PathService_1.projectRoot = projectRoot;
    };
    /**
     * Throws if one attempts to use a path from outside the project.
     *
     * The only forbidden thing is excessive '../', which means no
     * check is made to verify the paths provided really exist inside
     * the project (they can be yet-inexistent files)
     */
    PathService.prototype.createInternal = function (internalOrAbsolutePath) {
        if (!PathService_1.projectRoot) {
            throw new Error('PathService was not initialized. A IProjectFactory must be instantiated before this service');
        }
        if (path.relative(PathService_1.projectRoot, path.resolve(PathService_1.projectRoot, internalOrAbsolutePath)).match(/^(\.\.(\/|\\))/)) {
            throw new Error('Attempted to create InternalPath referencing outside the project.');
        }
        if (path.isAbsolute(internalOrAbsolutePath)) {
            internalOrAbsolutePath = path.relative(PathService_1.projectRoot, internalOrAbsolutePath);
        }
        // Convert to POSIX
        return new internal_path_1.InternalPath(this.toPosix(path.normalize(internalOrAbsolutePath)), PathService_1.projectRoot, this);
    };
    PathService.prototype.createAbsolute = function (absolutePath) {
        if (!PathService_1.projectRoot) {
            throw new Error('PathService was not initialized. A IProjectFactory must be instantiated before this service');
        }
        if (path.relative(PathService_1.projectRoot, absolutePath).match(/^(\.\.(\/|\\))/)) {
            throw new Error('Attempted to create AbsolutePath referencing outside the project.');
        }
        else if (!path.isAbsolute(absolutePath)) {
            throw new Error('Attempted to create AbsolutePath using a relative path');
        }
        return new absolute_path_1.AbsolutePath(path.normalize(absolutePath), PathService_1.projectRoot, this);
    };
    return PathService;
}());
PathService = PathService_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PathService);
exports.PathService = PathService;
var PathService_1;
