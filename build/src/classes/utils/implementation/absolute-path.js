"use strict";
var path = require("path");
var AbsolutePath = (function () {
    function AbsolutePath(stringRepresentation, projectRoot, pathService) {
        this.stringRepresentation = stringRepresentation;
        this.projectRoot = projectRoot;
        this.pathService = pathService;
    }
    AbsolutePath.prototype.equals = function (other) {
        return !path.relative(this.toString(), other.toString());
    };
    AbsolutePath.prototype.toInternal = function () {
        return this.pathService.createInternal(path.relative(this.projectRoot, this.toString()));
    };
    AbsolutePath.prototype.toString = function () {
        return this.stringRepresentation;
    };
    return AbsolutePath;
}());
exports.AbsolutePath = AbsolutePath;
