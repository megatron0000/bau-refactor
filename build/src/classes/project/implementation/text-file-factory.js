"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var text_file_1 = require("./text-file");
var inversify_1 = require("inversify");
var TextFileFactory = (function () {
    function TextFileFactory() {
    }
    TextFileFactory.prototype.create = function (config) {
        return new text_file_1.TextFile(config.path, config.content);
    };
    return TextFileFactory;
}());
TextFileFactory = __decorate([
    inversify_1.injectable()
], TextFileFactory);
exports.TextFileFactory = TextFileFactory;