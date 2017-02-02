"use strict";
var fs = require("fs");
var path = require("path");
var bau_source_file_1 = require("./bau-source-file");
var ts = require("ntypescript");
/**
 * IGNORES node_modules. This is done inside this.findFilePaths()
 */
var BauProject = (function () {
    /**
     * Assumes project is on cwd(). Nothing else is permitted
     *
     * Throws error if dir does not exist or if
     * it is not a dir (maybe it is a file) or if it
     * does not contain 'tsconfig.json'
     */
    function BauProject() {
        var projectRoot = process.cwd();
        if (!fs.existsSync(projectRoot) ||
            !fs.statSync(projectRoot).isDirectory() ||
            !fs.readdirSync(projectRoot).find(function (file) { return file === 'tsconfig.json'; })) {
            throw new ReferenceError("\n                Something wrong with folder specified as root. \n                Either isn't a directory, or doesn't exist, or doesn't contain a tsconfig.json\n                ");
        }
        // Maybe cwd() already is absolute path, which means path.resolve() is unnecessary
        this.absolutePath = path.resolve(projectRoot);
        this.sourceFiles = this.getBauSources();
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
    BauProject.prototype.findFilePaths = function () {
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
    BauProject.prototype.getBauSources = function () {
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
            .map(function (sourceFile) { return new bau_source_file_1.BauSourceFile(sourceFile, _this); });
    };
    /**
     * Accepts only a project-relative fileName
     *
     * Is smart enough to normalize path beforehand
     */
    BauProject.prototype.pathToSource = function (fileName) {
        var _this = this;
        return this.getBauSources().find(function (source) { return !path.relative(source.getAbsPath(), path.resolve(_this.getAbsPath(), fileName)); });
    };
    /**
     * Project´s absolute path (coincides with cwd() of the time of the creation of the project)
     */
    BauProject.prototype.getAbsPath = function () {
        return this.absolutePath;
    };
    return BauProject;
}());
exports.BauProject = BauProject;
