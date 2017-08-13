"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
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
    function Project(sourceFactory, pathService, projectRoot, forceTsConfig) {
        this.sourceFactory = sourceFactory;
        if (!fs.existsSync(projectRoot) ||
            !fs.statSync(projectRoot).isDirectory() ||
            (forceTsConfig &&
                !fs.readdirSync(projectRoot).find(function (file) { return file === 'tsconfig.json'; }))) {
            throw new ReferenceError("\n                Something wrong with folder specified as root. \n                Either isn't a directory, or doesn't exist, or doesn't contain a tsconfig.json\n                ");
        }
        // Maybe cwd() already is absolute path, which means path.resolve() is unnecessary
        this.absolutePath = pathService.createAbsolute(path.resolve(projectRoot));
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
             * If is a '.ts'/'.tsx' file, add it to output.
             * Else, if it is a directory, recurse over it
             */
            paths.forEach(function (pathElement) {
                var stat = fs.statSync(pathElement);
                if (stat.isFile() && path.extname(pathElement).match(/(\.tsx?)$/)) {
                    output.push(pathElement);
                }
                else if (stat.isDirectory()) {
                    helperFunction(pathElement);
                }
            });
        };
        helperFunction(this.absolutePath.toString());
        /**
         * Convert to paths relative to root folder and
         * ignore node_modules
         */
        return output.map(function (file) { return path.relative(_this.absolutePath.toString(), file); }).filter(function (file) { return !file.match(/node_modules/); });
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
        var compilerOptions = ts.defaultInitCompilerOptions;
        return ts.createProgram(this.findFilePaths().map(function (projectPath) { return path.join(_this.absolutePath.toString(), projectPath); }), compilerOptions)
            .getSourceFiles()
            .filter(function (sourceFile) { return !sourceFile.fileName.match(/node_modules/); })
            .filter(function (sourceFile) { return !path.relative(_this.absolutePath.toString(), sourceFile.fileName).match(/^(\.\.(\/|\\))/); })
            .map(function (sourceFile) { return _this.sourceFactory.create(sourceFile, _this); });
    };
    /**
     * Accepts only a project-relative fileName
     *
     * Is smart enough to normalize path beforehand
     *
     * Throws if filePath does not reference a valid SourceFile
     */
    Project.prototype.pathToSource = function (filePath) {
        var found = this.getSources().find(function (source) { return source.getProjectRelativePath().equals(filePath); });
        if (!found) {
            throw new Error("Attempted to get an inexistent SourceFile");
        }
        return found;
    };
    /**
     * Project´s absolute path (coincides with cwd() of the time of the creation of the project)
     */
    Project.prototype.getAbsPath = function () {
        return this.absolutePath;
    };
    return Project;
}());
exports.Project = Project;
