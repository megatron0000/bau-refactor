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
var ProjectFactory = (function () {
    function ProjectFactory(sourceFactory, pathService) {
        this.sourceFactory = sourceFactory;
        this.pathService = pathService;
        this.singletonInstance = null;
    }
    ProjectFactory.prototype.getSingletonProject = function (config) {
        if (config === void 0) { config = {
            projectRoot: process.cwd(),
            forceTsConfig: true
        }; }
        if (!this.singletonInstance) {
            this.pathService.init(config.projectRoot);
            this.singletonInstance = new project_1.Project(this.sourceFactory, this.pathService, config.projectRoot, config.forceTsConfig);
        }
        return this.singletonInstance;
    };
    return ProjectFactory;
}());
ProjectFactory = __decorate([
    inversify_2.injectable(),
    __param(0, inversify_1.inject('ISourceFileFactory')),
    __param(1, inversify_1.inject('IPathService')),
    __metadata("design:paramtypes", [Object, Object])
], ProjectFactory);
exports.ProjectFactory = ProjectFactory;
