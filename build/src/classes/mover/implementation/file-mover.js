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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var inversify_1 = require("inversify");
var path = require("path");
var FileMover = (function () {
    function FileMover(projectFactory, graphFactory, importService, pathService) {
        this.importService = importService;
        this.pathService = pathService;
        this.project = projectFactory.getSingletonProject();
        this.dependencyGraph = graphFactory.createGraph();
    }
    /**
     * Throws error if
     *  - fileName is not part of project
     *  - targetFileName is outside project
     *  - targetFileName already exists inside project
     *  - targetFileName is not a .ts file
     */
    FileMover.prototype.move = function (fileName, targetFileName) {
        var _this = this;
        /**
         * Not needed normalization
         */
        fileName = path.normalize(fileName);
        targetFileName = path.normalize(targetFileName);
        /**
         * Throw if source does not exist in project
         */
        var source;
        try {
            source = this.project.pathToSource(this.pathService.createInternal(fileName));
        }
        catch (e) {
            e.message = "File " + fileName + " is not a valid source file inside project";
            throw e;
        }
        /**
         * Throw if source does not have supported extension
         */
        if (!source.getProjectRelativePath().toString().match(/(\.tsx?)$/)) {
            throw new Error("File to be moved must be a .ts / .d.ts / .tsx file");
        }
        /**
         * Throw if target does not exist in project
         */
        var target;
        try {
            target = {
                relativePath: this.pathService.createInternal(targetFileName),
                absPath: this.pathService.createAbsolute(path.resolve(this.project.getAbsPath().toString(), targetFileName)),
                textFile: source.toTextFile()
            };
            target.textFile.changePath(target.relativePath);
        }
        catch (e) {
            e.message = "File " + targetFileName + " is maybe a reference to outside the project ?";
            throw e;
        }
        /**
         * Inutilize arguments
         */
        fileName = undefined;
        targetFileName = undefined;
        /**
         * Throw if destination already exists
         */
        if (fs.existsSync(target.absPath.toString())) {
            throw new Error("Intended target already exists.");
        }
        /**
         * Throw if target is not a .ts file
         */
        if (!target.relativePath.toString().match(/(\.tsx?)$/)) {
            throw new Error("Intended target must be a .ts / .d.ts / .tsx file");
        }
        /**
         * Correct dependencies within source
         */
        this.dependencyGraph.getDependencies(source.getProjectRelativePath())
            .map(function (dependencyPath) { return source.getRelativeImports().find(function (importt) { return importt.resolved.equals(dependencyPath); }); })
            .forEach(function (linedImport) {
            target.textFile.replaceRange({
                line: linedImport.line,
                startCol: linedImport.startCol,
                endCol: linedImport.endCol,
                newText: _this.importService.buildLiteral(target.relativePath, linedImport.resolved)
            });
        });
        target.textFile.write({
            overwrite: false
        });
        /**
         * Correct dependents on source
         */
        this.dependencyGraph.getDependents(source.getProjectRelativePath())
            .map(function (dependentPath) { return _this.project.pathToSource(dependentPath); })
            .map(function (dependentSourceFile) { return ({
            textFile: dependentSourceFile.toTextFile(),
            linedImport: dependentSourceFile.getRelativeImports().find(function (importt) { return importt.resolved.equals(source.getProjectRelativePath()); })
        }); })
            .forEach(function (dependent) {
            dependent.textFile.replaceRange({
                line: dependent.linedImport.line,
                startCol: dependent.linedImport.startCol,
                endCol: dependent.linedImport.endCol,
                newText: _this.importService.buildLiteral(dependent.textFile.getPath(), target.relativePath)
            });
            dependent.textFile.write({
                overwrite: true
            });
        });
        /**
         * Remove original file
         */
        fs.removeSync(source.getAbsPath().toString());
    };
    FileMover = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject('IProjectFactory')),
        __param(1, inversify_1.inject('IGraphFactory')),
        __param(2, inversify_1.inject('IImportService')),
        __param(3, inversify_1.inject('IPathService')),
        __metadata("design:paramtypes", [Object, Object, Object, Object])
    ], FileMover);
    return FileMover;
}());
exports.FileMover = FileMover;
