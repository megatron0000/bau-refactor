"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
/**
 * It is designed to be always part of a Project
 * (hence the need for it in the constructor)
 *
 * NOT INJECTABLE
 */
var SourceFile = (function () {
    /**
     * Throws Error if invalid arguments
     */
    function SourceFile(source, parentProject, pathService, textFileFactory) {
        if (!source || !parentProject) {
            throw new ReferenceError('BauSourceFile must be valid and be part of a BauProject');
        }
        this.sourceFile = source;
        this.parentProject = parentProject;
        this.pathService = pathService;
        this.textFileFactory = textFileFactory;
    }
    /**
     * Mimics typescript resolver. Returns POSIX paths
     *
     * Throws if not found
     */
    SourceFile.prototype.__deprecated__resolveImport = function (rawPath) {
        var importAbsPath = path.resolve(this.getAbsDir().toString(), rawPath);
        // Do nothing if import is already well defined
        if (fs.existsSync(importAbsPath) &&
            fs.statSync(importAbsPath).isFile() &&
            path.extname(importAbsPath).match(/(\.ts)|(\.tsx)/)) {
            return rawPath; // Now we know it has extension
        }
        // Try to parse as file
        if (fs.existsSync(importAbsPath + '.ts')) {
            return rawPath + '.ts';
        }
        if (fs.existsSync(importAbsPath + '.tsx')) {
            return rawPath + '.tsx';
        }
        if (fs.existsSync(importAbsPath + '.d.ts')) {
            return rawPath + '.d.ts';
        }
        // At this point, it must be a directory (does it exist at all ?)
        if (fs.existsSync(importAbsPath) && fs.statSync(importAbsPath).isDirectory()) {
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
                    return path.join(rawPath, 'index.ts').replace(/\\/g, '/');
                }
                if (indexTsx) {
                    return path.join(rawPath, 'index.tsx').replace(/\\/g, '/');
                }
                if (indexDTs) {
                    return path.join(rawPath, 'index.d.ts').replace(/\\/g, '/');
                }
            }
            else {
                return path.join(rawPath, packageContent.typings).replace(/\\/g, '/');
            }
        }
        // Problems...
        throw new ReferenceError("Package " + rawPath + ", imported by file " + this.getProjectRelativePath() + ", has some oddity regarding its main file");
    };
    /**
     * Deprecated version of this method used to return
     * file-relative path of dependency. Now we want
     * project-relative path, hence the deprecation
     */
    SourceFile.prototype.resolveImport = function (rawPath) {
        // return this.pathService.createInternal(
        //     path.join(
        //         this.getProjectRelativeDir().toString(),
        //         this.__deprecated__resolveImport(rawPath)
        //     )
        // );
        return this.getProjectRelativeDir().join(this.__deprecated__resolveImport(rawPath));
    };
    /**
     * Returns array of relative imports under rootNode.
     * 'Relative' means relative to file's directory
     *
     * All imports are available in two forms: resolved (explicited) and unresolved (as is)
     */
    SourceFile.prototype.getRelativeImports = function () {
        var _this = this;
        /**
         * Where imports gathered by 'traverse' are stored
         */
        var imports = [];
        /**
         * Collects relative imports below rootNode (which must be a ts.SourceFile)
         */
        var traverse = function (rootNode) {
            var originSourceFile = rootNode;
            /**
             * 'pos' is position from the first character
             * of the file (default used by typescript).
             *
             * We want a column starting from the beginning
             * of the line
             */
            var computeColOfPosition = function (pos, sourceFile) {
                var starts = ts.computeLineStarts(sourceFile.getFullText(sourceFile));
                var lineStart;
                for (var _i = 0, starts_1 = starts; _i < starts_1.length; _i++) {
                    var start = starts_1[_i];
                    if (start <= pos) {
                        lineStart = start;
                    }
                    else {
                        break;
                    }
                }
                return pos - lineStart;
            };
            var __traverse = function (node) {
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
                                    resolved: undefined,
                                    line: ts.getLineAndCharacterOfPosition(_this.sourceFile, subChild.pos).line,
                                    startCol: computeColOfPosition(subChild.getStart(originSourceFile), originSourceFile) + 1,
                                    endCol: computeColOfPosition(subChild.getEnd(), originSourceFile) - 2 // Notice correction here (-2) to avoid semicolon and end comma
                                });
                            }
                        }
                        else {
                            searchChild(subChild);
                        }
                    });
                };
                ts.forEachChild(node, function (child) {
                    if (child.kind === ts.SyntaxKind.ImportDeclaration || child.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                        searchChild(child);
                    }
                    else {
                        __traverse(child);
                    }
                });
            };
            __traverse(rootNode);
        };
        traverse(this.sourceFile);
        // Resolve implicit names (like index.ts)
        return imports.map(function (importt) { return ({
            resolved: _this.resolveImport(importt.unresolved),
            line: importt.line,
            unresolved: importt.unresolved,
            startCol: importt.startCol,
            endCol: importt.endCol
        }); });
    };
    ;
    SourceFile.prototype.toTextFile = function () {
        return this.textFileFactory.create({
            content: this.sourceFile.getFullText(this.sourceFile),
            path: this.getProjectRelativePath()
        });
    };
    SourceFile.prototype.getAbsPath = function () {
        var parentPath = this.parentProject
            .getAbsPath()
            .toInternal();
        if (path.isAbsolute(this.sourceFile.fileName)) {
            return this.pathService.createAbsolute(this.sourceFile.fileName);
        }
        else {
            return parentPath.join(this.sourceFile.fileName).toAbsolute();
        }
    };
    /**
     * Path relative to parent project's path
     */
    SourceFile.prototype.getProjectRelativePath = function () {
        return this.getAbsPath().toInternal();
    };
    /**
     * Absolute path of container directory
     */
    SourceFile.prototype.getAbsDir = function () {
        return this.pathService.createAbsolute(path.dirname(this.getAbsPath().toString()));
    };
    SourceFile.prototype.getProjectRelativeDir = function () {
        return this.pathService.createInternal(path.dirname(this.getProjectRelativePath().toString()));
    };
    return SourceFile;
}());
exports.SourceFile = SourceFile;
