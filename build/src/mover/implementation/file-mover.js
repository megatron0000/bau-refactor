"use strict";
var import_service_1 = require("../../utils/implementation/import-service");
var cp = require("child_process");
var readline = require("readline");
var path = require("path");
var fs = require("fs-extra");
var FileMover = (function () {
    function FileMover(project, dependencyGraph) {
        this.dependencyGraph = dependencyGraph;
        this.project = project;
        this.importService = new import_service_1.ImportService();
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
         * Ensure OS-like paths
         */
        fileName = path.normalize(fileName);
        targetFileName = path.normalize(targetFileName);
        var source = this.project.pathToSource(fileName);
        var target = {
            relativePath: targetFileName,
            absPath: path.resolve(this.project.getAbsPath(), targetFileName)
        };
        /**
         * Inutilize arguments
         */
        fileName = undefined;
        targetFileName = undefined;
        /**
         * Throw if source does not exist in project
         */
        if (!source) {
            throw new ReferenceError("File to be moved does not exist inside project");
        }
        /**
         * Throw if destination is outside project
         */
        if (path.relative(this.project.getAbsPath(), target.absPath).match(/\.\./)) {
            throw new ReferenceError("Intended target cannot be outside of project");
        }
        /**
         * Throw if destination already exists
         */
        if (fs.existsSync(target.absPath)) {
            throw new Error("Intended target already exists.");
        }
        /**
         * Throw if target is not a .ts file
         */
        if (!target.relativePath.match(/\.ts$/)) {
            throw new Error("Intended target must be a .ts file");
        }
        /**
         * Try to move first. If this fails, no text substitution must be done
         *
         * Create intermediary dirs if necessary (writeFileSync does not do this)
         */
        fs.createFileSync(target.absPath);
        fs.writeFileSync(target.absPath, fs.readFileSync(source.getAbsPath()) // Buffer
        );
        /**
         * Function to make file text substitution easier (and reusable).
         *
         * Does not write to file !!
         *
         * Returns Promise with new content (all intended replacements done).
         *
         * On error, Promise is rejected with due Error
         */
        var replace = function (fileReplacement) {
            return new Promise(function (resolve, reject) {
                try {
                    var newContent_1 = '';
                    var readInterface = readline.createInterface({
                        input: fs.createReadStream(fileReplacement.path)
                    });
                    var lineCounter_1 = 0;
                    readInterface.addListener('line', function (line) {
                        var currReplacement;
                        if (currReplacement = fileReplacement.replacements.find(function (replacement) { return replacement.line === lineCounter_1; })) {
                            newContent_1 += line.replace(currReplacement.original, currReplacement.new) + '\n';
                        }
                        else {
                            newContent_1 += line + '\n';
                        }
                        lineCounter_1++;
                    });
                    readInterface.addListener('close', function () { return resolve({
                        path: fileReplacement.path,
                        content: newContent_1
                    }); });
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        /**
         * Uses above defined function, however effectively writes to intended files.
         *
         * Resolves only if all substitutions went well.
         *
         * In case any of them went wrong, rejects with due error
         */
        var replaceMultiple = function (requests) {
            return Promise.all(requests.map(function (request) { return replace(request); })).then((function (results) {
                for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                    var result = results_1[_i];
                    fs.writeFileSync(result.path, result.content);
                }
            }));
        };
        /**
         * Escapes a string to avoid RegExp metacharacters.
         *
         * Example: quote('test.') === 'test\.'
         */
        var quote = function (string) { return (string + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'); };
        /**
         * Remember that BauDependencyGraph works with project-relative paths
         */
        var dependencies = this.dependencyGraph
            .getDependencies(source.getProjectRelativePath())
            .map(function (depPath) { return _this.project.pathToSource(depPath); });
        var dependents = this.dependencyGraph
            .getDependents(source.getProjectRelativePath())
            .map(function (depPath) { return _this.project.pathToSource(depPath); });
        /**
         * Build FileReplacement[]
         */
        var requests = [];
        // Corrections in moved file
        requests.push({
            path: target.absPath,
            replacements: dependencies.map(function (dep) {
                // Find obj with .line, .unresolved and .path
                var importt = source
                    .getRelativeImports()
                    .find(function (importWithLine) { return !path.relative(path.resolve(source.getAbsDir(), importWithLine.path), dep.getAbsPath()); });
                return {
                    line: importt.line,
                    original: new RegExp('(\'|")' + quote(importt.unresolved) + '(?:\'|")'),
                    new: '$1' + _this.importService.buildLiteral(target.absPath, dep.getAbsPath()) + '$1'
                };
            })
        });
        var _loop_1 = function (dependent) {
            var importt = dependent
                .getRelativeImports()
                .find(function (importWithLine) { return !path.relative(path.resolve(dependent.getAbsDir(), importWithLine.path), source.getAbsPath()); });
            requests.push({
                path: dependent.getAbsPath(),
                replacements: [{
                        line: importt.line,
                        original: new RegExp('(\'|")' + quote(importt.unresolved) + '(?:\'|")'),
                        new: '$1' + this_1.importService.buildLiteral(dependent.getAbsPath(), target.absPath) + '$1'
                    }]
            });
        };
        var this_1 = this;
        // Corrections in dependents of moved file. THEY MUST IMPORT ONLY ONCE
        for (var _i = 0, dependents_1 = dependents; _i < dependents_1.length; _i++) {
            var dependent = dependents_1[_i];
            _loop_1(dependent);
        }
        /**
         * Finalize writing the import corrections and deleting original
         */
        replaceMultiple(requests)
            .then(function () {
            cp.execSync('rimraf ' + source.getAbsPath(), {
                cwd: _this.project.getAbsPath()
            });
            console.log('DONE');
        })
            .catch(function (e) {
            cp.execSync('rimraf ' + target.absPath, {
                cwd: _this.project.getAbsPath()
            });
            console.log("\n                    ----------------------------------------------------\n                    An error was found. Relax: No rewrite has been done.\n                    Below, details of the error:\n                    ----------------------------------------------------\n                    ");
            console.error(e);
            process.exit(1);
        });
    };
    return FileMover;
}());
exports.FileMover = FileMover;
