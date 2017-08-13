"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var TextFile = (function () {
    function TextFile(path, content) {
        this.path = path;
        this.lineBreak = content.match(/\r\n|\n/)[0] || '\n';
        this.lines = content.split(this.lineBreak);
    }
    TextFile.prototype.columnWithinBounds = function (column, line) {
        return column < line.length && column >= 0;
    };
    TextFile.prototype.lineNumberWithinBounds = function (lineNumber) {
        return lineNumber >= 0 && lineNumber < this.lines.length;
    };
    /**
     * Throws if line is out of bounds
     */
    TextFile.prototype.setLine = function (lineNumber, content) {
        if (!this.lineNumberWithinBounds(lineNumber)) {
            throw new Error("Line number out of bounds");
        }
        this.lines[lineNumber] = content;
    };
    TextFile.prototype.getContent = function () {
        return this.lines.join(this.lineBreak);
    };
    TextFile.prototype.getPath = function () {
        return this.path;
    };
    TextFile.prototype.changePath = function (newPath) {
        this.path = newPath;
    };
    /**
     * Throws if line is out of bounds
     */
    TextFile.prototype.getLine = function (lineNumber) {
        if (!this.lineNumberWithinBounds(lineNumber)) {
            throw new Error("Line number out of bounds");
        }
        return this.lines[lineNumber];
    };
    /**
     * Throws if anything is out of bounds
     */
    TextFile.prototype.replaceRange = function (config) {
        var line = this.getLine(config.line);
        if (!this.columnWithinBounds(config.startCol, line) || !this.columnWithinBounds(config.endCol, line)) {
            throw new Error("Attempted to access column out of bounds of line");
        }
        this.setLine(config.line, line.substr(0, config.startCol) + config.newText + line.substr(config.endCol + 1));
    };
    TextFile.prototype.write = function (config) {
        if (!config.overwrite && fs.existsSync(this.path.toAbsolute().toString())) {
            throw new Error("Attempted to write an already existent TextFile without overwrite flag");
        }
        fs.createFileSync(this.path.toAbsolute().toString());
        fs.writeFileSync(this.path.toAbsolute().toString(), this.lines.join(this.lineBreak));
    };
    return TextFile;
}());
exports.TextFile = TextFile;
