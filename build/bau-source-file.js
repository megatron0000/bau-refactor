"use strict";
var path = require("path");
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
     * Returns array of relative imports under rootNode.
     *
     * 'Relative' means relative to file's directory
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
            ts.forEachChild(rootNode, function (child) {
                if (child.kind === ts.SyntaxKind.ImportDeclaration) {
                    ts.forEachChild(child, function (subChild) {
                        if (subChild.kind === ts.SyntaxKind.StringLiteral &&
                            subChild.text.replace(/["']/g, '').match(/^(?:(\.\/)|(\.\.\/))/)) {
                            imports.push({
                                path: subChild.text.replace(/['"]/g, ''),
                                line: ts.getLineAndCharacterOfPosition(_this.sourceFile, subChild.pos).line
                            });
                        }
                    });
                }
                else {
                    traverse(child);
                }
            });
        };
        traverse(this.sourceFile);
        return imports;
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
     * Absolute absolute path of container directory
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
