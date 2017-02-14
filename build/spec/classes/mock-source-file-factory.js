"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var inversify_1 = require("inversify");
var path = require("path");
var MockSourceFile = (function () {
    function MockSourceFile(source, parent) {
        this.source = source;
        this.parent = parent;
    }
    MockSourceFile.prototype.getRelativeImports = function () {
        throw new Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getAbsPath = function () {
        return path.resolve(this.parent.getAbsPath(), this.source.fileName);
    };
    MockSourceFile.prototype.getProjectRelativePath = function () {
        throw new Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getAbsDir = function () {
        throw new Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getProjectRelativeDir = function () {
        throw new Error('Not implemented yet.');
    };
    return MockSourceFile;
}());
var MockSourceFileFactory = (function () {
    function MockSourceFileFactory() {
    }
    MockSourceFileFactory.prototype.create = function (source, parentProject) {
        return new MockSourceFile(source, parentProject);
    };
    return MockSourceFileFactory;
}());
MockSourceFileFactory = __decorate([
    inversify_1.injectable()
], MockSourceFileFactory);
exports.MockSourceFileFactory = MockSourceFileFactory;
