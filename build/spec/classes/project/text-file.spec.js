"use strict";
var inversify_config_1 = require("../../../src/inversify.config");
var fs = require("fs-extra");
var path = require("path");
/// <reference types="jasmine" />
var container = new inversify_config_1.ContainerBuilder().build();
var projectRoot = path.resolve(__dirname, '../../mock-project/temp');
fs.mkdirSync(projectRoot);
/**
 * PathService requires a project to be created before it
 */
container.get('IProjectFactory').getSingletonProject({
    projectRoot: projectRoot,
    forceTsConfig: false
});
var pathService = container.get('IPathService');
var textFileFactory = container.get('ITextFileFactory');
var contents = {
    windows: 'Some line \r\n another line \r\n',
    unix: 'Some line \n another line \n'
};
var windowsTextFile = textFileFactory.create({
    content: contents.windows,
    path: pathService.createInternal('windowsTextFile.something')
});
var unixTextFile = textFileFactory.create({
    content: contents.unix,
    path: pathService.createInternal('windowsTextFile.something')
});
describe('TextFile', function () {
    it('Should not discard last line, even if empty', function () {
        expect(windowsTextFile.getLine(2)).toBe('');
        expect(unixTextFile.getLine(2)).toBe('');
    });
    it('Should not modify lineBreak originally used', function () {
        expect(windowsTextFile.getContent()).toBe(contents.windows);
        expect(unixTextFile.getContent()).toBe(contents.unix);
    });
    it('Should throw if requested line is out of bounds', function () {
        var exception = null;
        try {
            windowsTextFile.getLine(3);
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should throw if range to be replaced is out of bounds (line or column)', function () {
        var exception = null;
        try {
            windowsTextFile.replaceRange({
                line: 100000000000000000,
                startCol: 1,
                endCol: 2,
                newText: 'anything. does not matter'
            });
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
        exception = null;
        try {
            windowsTextFile.replaceRange({
                line: 0,
                startCol: -1,
                endCol: 2,
                newText: 'anything. does not matter'
            });
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
        exception = null;
        try {
            windowsTextFile.replaceRange({
                line: 0,
                startCol: 1,
                endCol: -1,
                newText: 'anything. does not matter'
            });
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });
    it('Should correctly replace line if bounds are OK', function () {
        windowsTextFile.replaceRange({
            line: 0,
            startCol: 4,
            endCol: 4,
            newText: ' weird '
        });
        expect(windowsTextFile.getContent()).toBe('Some weird line \r\n another line \r\n');
    });
    it('Should write to file-system, overwriting existing or not (user´s choice)', function () {
        windowsTextFile.write({
            overwrite: false
        });
        expect(fs.readFileSync(path.resolve(projectRoot, 'windowsTextFile.something'), 'utf8')).toBe('Some weird line \r\n another line \r\n');
        var exception = null;
        try {
            windowsTextFile.write({
                overwrite: false
            });
        }
        catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
        windowsTextFile.replaceRange({
            line: 0,
            startCol: 4,
            endCol: 4,
            newText: ' really '
        });
        windowsTextFile.write({
            overwrite: true
        });
        expect(fs.readFileSync(path.resolve(projectRoot, 'windowsTextFile.something'), 'utf8')).toBe('Some really weird line \r\n another line \r\n');
        fs.removeSync(projectRoot);
    });
});
