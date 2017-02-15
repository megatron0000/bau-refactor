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
var inversify_1 = require("inversify");
var MockSourceFile = (function () {
    function MockSourceFile(source, parent, pathService) {
        this.source = source;
        this.parent = parent;
        this.pathService = pathService;
    }
    MockSourceFile.prototype.getRelativeImports = function () {
        throw new Error('Not implemented yet.');
    };
    MockSourceFile.prototype.getAbsPath = function () {
        return this.parent
            .getAbsPath()
            .toInternal()
            .join(this.source.fileName)
            .toAbsolute();
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
    function MockSourceFileFactory(pathService) {
        this.pathService = pathService;
    }
    MockSourceFileFactory.prototype.create = function (source, parentProject) {
        return new MockSourceFile(source, parentProject, this.pathService);
    };
    return MockSourceFileFactory;
}());
MockSourceFileFactory = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('IPathService')),
    __metadata("design:paramtypes", [Object])
], MockSourceFileFactory);
exports.MockSourceFileFactory = MockSourceFileFactory;
