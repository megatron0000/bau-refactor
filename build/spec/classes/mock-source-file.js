"use strict";
var error_1 = require("tslint/lib/error");
var path = require("path");
var MockSourceFile = (function () {
    function MockSourceFile(source, parent) {
        this.source = source;
        this.parent = parent;
    }
    MockSourceFile.prototype.getRelativeImports = function () {
        throw new error_1.Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getAbsPath = function () {
        return path.resolve(this.parent.getAbsPath(), this.source.fileName);
    };
    MockSourceFile.prototype.getProjectRelativePath = function () {
        throw new error_1.Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getAbsDir = function () {
        throw new error_1.Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getProjectRelativeDir = function () {
        throw new error_1.Error('Not implemented yet.');
    };
    return MockSourceFile;
}());
exports.MockSourceFile = MockSourceFile;
