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
var MockProjectFactory = MockProjectFactory_1 = (function () {
    function MockProjectFactory(pathService) {
        this.pathService = pathService;
    }
    MockProjectFactory.prototype.getSingletonProject = function (config) {
        var _this = this;
        if (config === void 0) { config = {
            projectRoot: process.cwd(),
            forceTsConfig: true
        }; }
        if (!MockProjectFactory_1.singletonProject) {
            this.pathService.init(config.projectRoot);
            MockProjectFactory_1.singletonProject = {
                getAbsPath: function () { return _this.pathService.createAbsolute(config.projectRoot); },
                getSources: function () { return null; },
                pathToSource: function () { return null; }
            };
        }
        return MockProjectFactory_1.singletonProject;
    };
    return MockProjectFactory;
}());
MockProjectFactory.singletonProject = null;
MockProjectFactory = MockProjectFactory_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('IPathService')),
    __metadata("design:paramtypes", [Object])
], MockProjectFactory);
exports.MockProjectFactory = MockProjectFactory;
var MockProjectFactory_1;
