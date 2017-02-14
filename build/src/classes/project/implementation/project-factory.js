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
var project_1 = require("./project");
var inversify_1 = require("inversify");
var inversify_2 = require("inversify");
var ProjectFactory = ProjectFactory_1 = (function () {
    function ProjectFactory(sourceFactory) {
        this.sourceFactory = sourceFactory;
    }
    ProjectFactory.prototype.getSingletonProject = function (config) {
        if (config === void 0) { config = {
            projectRoot: process.cwd(),
            forceTsConfig: true
        }; }
        ProjectFactory_1.singletonInstance ? null :
            ProjectFactory_1.singletonInstance = new project_1.Project(this.sourceFactory, config.projectRoot, config.forceTsConfig);
        return ProjectFactory_1.singletonInstance;
    };
    return ProjectFactory;
}());
ProjectFactory.singletonInstance = null;
ProjectFactory = ProjectFactory_1 = __decorate([
    inversify_2.injectable(),
    __param(0, inversify_1.inject('ISourceFileFactory')),
    __metadata("design:paramtypes", [Object])
], ProjectFactory);
exports.ProjectFactory = ProjectFactory;
var ProjectFactory_1;
