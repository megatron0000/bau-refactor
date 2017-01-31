"use strict";
var path = require("path");
var fs = require("fs-extra");
/**
 * It is designed to be always part of a BauProject
 * (hence the need for it in the constructor)
 */
var BauSourceFile = (function () {
    /**
     * Throws Error if invalid arguments
     */
    function BauSourceFile(source, parentProject) {
        if (!source || !parentProject) {
            throw new ReferenceError('BauSourceFile must be valid and be part of a BauProject');
        }
        this.sourceFile = source;
        this.parentProject = parentProject;
    }
    /**
     * Mimics typescript resolver
     *
     * Throws if not found
     */
    BauSourceFile.prototype.resolveImport = function (rawPath) {
        var importAbsPath = path.resolve(this.getAbsDir(), rawPath);
        // Do nothing if import is already well defined
        if (fs.existsSync(importAbsPath) && fs.statSync(importAbsPath).isFile() && path.extname(importAbsPath).match(/(\.ts)|(\.tsx)/)) {
            return rawPath; // Now we know it has extension
        }
        // Try to parse as file
        if (fs.existsSync(importAbsPath + '.ts')) {
            return rawPath + '.ts';
        }
        if (fs.existsSync(importAbsPath + '.tsx')) {
            return rawPath + '.timportAbsPathsx';
        }
        if (fs.existsSync(importAbsPath + '.d.ts')) {
            return rawPath + '.d.ts';
        }
        // At this point, it must be a directory
        if (fs.statSync(importAbsPath).isDirectory()) {
            // Search for package.json and/or index.ts inside it
            var dirContents = fs.readdirSync(importAbsPath);
            var packageJson = dirContents.find(function (content) { return content === 'package.json'; });
            var packageContent = void 0;
            var indexTs = dirContents.find(function (content) { return content === 'index.ts'; });
            var indexTsx = dirContents.find(function (content) { return content === 'index.tsx'; });
            var indexDTs = dirContents.find(function (content) { return content === 'index.d.ts'; });
            if (packageJson) {
                packageContent = JSON.parse(fs.readFileSync(path.resolve(importAbsPath, 'package.json'), 'utf8'));
            }
            // No package || Yes package but No Typings
            if (!packageJson || (packageJson && !packageContent.typings)) {
                if (indexTs) {
                    return path.join(rawPath, 'index.ts').replace(/\\/, '/');
                }
                if (indexTsx) {
                    return path.join(rawPath, 'index.tsx').replace(/\\/, '/');
                }
                if (indexDTs) {
                    return path.join(rawPath, 'index.d.ts').replace(/\\/, '/');
                }
            }
            else {
                return path.join(rawPath, packageContent.typings).replace(/\\/, '/');
            }
        }
        // Problems...
        throw new ReferenceError("Package " + rawPath + ", imported by file " + this.getProjectRelativePath() + ", has some oddity regarding its main file");
    };
    /**
     * Returns array of relative imports under rootNode.
     * 'Relative' means relative to file's directory
     *
     * All imports are available in two forms: resolved (explicited) and unresolved (as is)
     */
    BauSourceFile.prototype.getRelativeImports = function () {
        var _this = this;
        /**
         * Where imports gathered by 'traverse' are stored
         */
        var imports = [];
        /**
         * Collects relative imports below rootNode
         */
        var traverse = function (rootNode) {
            /**
             * Searches inside a node to find a StringLiteral.
             *
             * Must only be used if 'c' (argument) is an IMPORT STATEMENT
             */
            var searchChild = function (c) {
                ts.forEachChild(c, function (subChild) {
                    if (subChild.kind === ts.SyntaxKind.StringLiteral) {
                        if (subChild.text.replace(/["']/g, '').match(/^(?:(\.\/)|(\.\.\/))/)) {
                            imports.push({
                                unresolved: subChild.text.replace(/['"]/g, ''),
                                path: subChild.text.replace(/['"]/g, ''),
                                line: ts.getLineAndCharacterOfPosition(_this.sourceFile, subChild.pos).line
                            });
                        }
                    }
                    else {
                        searchChild(subChild);
                    }
                });
            };
            ts.forEachChild(rootNode, function (child) {
                if (child.kind === ts.SyntaxKind.ImportDeclaration || child.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                    searchChild(child);
                }
                else {
                    traverse(child);
                }
            });
        };
        traverse(this.sourceFile);
        // Resolve implicit names (like index.ts) and add initial ./ if needed
        return imports.map(function (importt) { return ({
            path: _this.resolveImport(importt.path),
            line: importt.line,
            unresolved: importt.unresolved
        }); }).map(function (importt) {
            if (!importt.path.match(/^(\.\/|\.\.\/)/)) {
                importt.path = './' + importt.path;
            }
            return importt;
        });
    };
    ;
    BauSourceFile.prototype.getAbsPath = function () {
        return path.resolve(this.parentProject.getAbsPath(), this.sourceFile.fileName);
    };
    /**
     * Path relative to parent project's path
     */
    BauSourceFile.prototype.getProjectRelativePath = function () {
        return path.relative(this.parentProject.getAbsPath(), this.getAbsPath());
    };
    /**
     * Absolute path of container directory
     */
    BauSourceFile.prototype.getAbsDir = function () {
        return path.dirname(this.getAbsPath());
    };
    BauSourceFile.prototype.getProjectRelativeDir = function () {
        return path.dirname(this.getProjectRelativePath());
    };
    return BauSourceFile;
}());
exports.BauSourceFile = BauSourceFile;
