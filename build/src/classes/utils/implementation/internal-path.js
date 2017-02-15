"use strict";
var path = require("path");
var InternalPath = (function () {
    /**
     * Responsibility of IPathService is to
     * provide 'stringRepresentation' already in
     * POSIX format
     */
    function InternalPath(stringRepresentation, projectRoot, pathService) {
        this.stringRepresentation = stringRepresentation;
        this.projectRoot = projectRoot;
        this.pathService = pathService;
    }
    InternalPath.prototype.equals = function (other) {
        return !path.relative(this.toString(), other.toString());
    };
    InternalPath.prototype.toAbsolute = function () {
        return this.pathService.createAbsolute(path.join(this.projectRoot, this.toString()));
    };
    InternalPath.prototype.toString = function () {
        return this.stringRepresentation;
    };
    InternalPath.prototype.join = function () {
        var other = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            other[_i] = arguments[_i];
        }
        return this.pathService.createInternal(path.join.apply(path, [this.toString()].concat(other)));
    };
    return InternalPath;
}());
exports.InternalPath = InternalPath;
