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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var fs = require("fs");
var inversify_1 = require("inversify");
var ts = require("ntypescript");
var path = require("path");
/**
 * IGNORES node_modules. This is done inside this.findFilePaths()
 *
 * NOT INJECTABLE
 */
var Project = (function () {
    /**
     * Assumes project is on cwd(). Nothing else is permitted
     *
     * Throws error if dir does not exist or if
     * it is not a dir (maybe it is a file) or if it
     * does not contain 'tsconfig.json'
     */
    function Project(sourceFactory) {
        this.sourceFactory = sourceFactory;
        var projectRoot = process.cwd();
        if (!fs.existsSync(projectRoot) ||
            !fs.statSync(projectRoot).isDirectory() ||
            !fs.readdirSync(projectRoot).find(function (file) { return file === 'tsconfig.json'; })) {
            throw new ReferenceError("\n                Something wrong with folder specified as root. \n                Either isn't a directory, or doesn't exist, or doesn't contain a tsconfig.json\n                ");
        }
        // Maybe cwd() already is absolute path, which means path.resolve() is unnecessary
        this.absolutePath = path.resolve(projectRoot);
        this.sourceFiles = this.getSources();
    }
    // protected compilerOptions: ts.CompilerOptions;
    /**
     * Get all .ts files under the project and return an array
     * of their paths relative to root folder.
     *
     * Throws Error if IO goes wrong somewhere
     *
     * IGNORES node_modules
     */
    Project.prototype.findFilePaths = function () {
        var _this = this;
        var output = [];
        /**
         * 'directory' must contain only absolute paths
         */
        var helperFunction = function (directory) {
            /**
             * Get content[] of input directory. Note we .map()
             * all paths to absolute
             */
            var paths = fs.readdirSync(directory).map(function (file) { return path.resolve(directory, file); });
            /**
             * If is a '.ts' file, add it to output.
             * Else, if it is a directory, recurse over it
             */
            paths.forEach(function (pathElement) {
                var stat = fs.statSync(pathElement);
                if (stat.isFile() && path.extname(pathElement) === '.ts') {
                    output.push(pathElement);
                }
                else if (stat.isDirectory()) {
                    helperFunction(pathElement);
                }
            });
        };
        helperFunction(this.absolutePath);
        /**
         * Convert to paths relative to root folder and
         * ignore node_modules
         */
        return output.map(function (file) { return path.relative(_this.absolutePath, file); }).filter(function (file) { return !file.match(/node_modules/); });
    };
    /**
     * Uses this.findFilePaths()
     *
     * Will Throw Error if IO fails somewhere
     */
    Project.prototype.getSources = function () {
        var _this = this;
        /**
         * Be smart and return what has already been built
         */
        if (this.sourceFiles) {
            return this.sourceFiles;
        }
        /**
         * Paths supplied to ts.createProgram must be relative to project root
         *
         * Program is created with some external libraries included. We don't
         * want this, so we filter them out
         */
        return ts.createProgram(this.findFilePaths(), ts.defaultInitCompilerOptions)
            .getSourceFiles()
            .filter(function (sourceFile) { return !sourceFile.fileName.match(/node_modules/); })
            .map(function (sourceFile) { return _this.sourceFactory.create(sourceFile, _this); });
    };
    /**
     * Accepts only a project-relative fileName
     *
     * Is smart enough to normalize path beforehand
     */
    Project.prototype.pathToSource = function (fileName) {
        var _this = this;
        return this.getSources().find(function (source) { return !path.relative(source.getAbsPath(), path.resolve(_this.getAbsPath(), fileName)); });
    };
    /**
     * Project´s absolute path (coincides with cwd() of the time of the creation of the project)
     */
    Project.prototype.getAbsPath = function () {
        return this.absolutePath;
    };
    return Project;
}());
Project = __decorate([
    __param(0, inversify_1.inject('ISourceFileFactory')),
    __metadata("design:paramtypes", [Object])
], Project);
exports.Project = Project;
