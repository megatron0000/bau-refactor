import { IPathService } from '../../../src/classes/utils/i-path-service';
import { IProjectFactory } from '../../../src/classes/project/i-project-factory';
import { ITextFileFactory } from '../../../src/classes/project/i-text-file-factory';
import { ContainerBuilder } from '../../../src/inversify.config';
import fs = require('fs-extra');
import path = require('path');
/// <reference types="jasmine" />

let container = new ContainerBuilder().build();

let projectRoot = path.resolve(__dirname, '../../mock-project/temp');
fs.mkdirSync(projectRoot);

/**
 * PathService requires a project to be created before it
 */
container.get<IProjectFactory>('IProjectFactory').getSingletonProject({
    projectRoot: projectRoot,
    forceTsConfig: false
});

let pathService = container.get<IPathService>('IPathService');

let textFileFactory = container.get<ITextFileFactory>('ITextFileFactory');

let contents = {
    windows: 'Some line \r\n another line \r\n',
    unix: 'Some line \n another line \n'
};

let windowsTextFile = textFileFactory.create({
    content: contents.windows,
    path: pathService.createInternal('windowsTextFile.something')
});

let unixTextFile = textFileFactory.create({
    content: contents.unix,
    path: pathService.createInternal('windowsTextFile.something')
});

describe('TextFile', () => {
    it('Should not discard last line, even if empty', () => {
        expect(windowsTextFile.getLine(2)).toBe('');
        expect(unixTextFile.getLine(2)).toBe('');
    });

    it('Should not modify lineBreak originally used', () => {
        expect(windowsTextFile.getContent()).toBe(contents.windows);
        expect(unixTextFile.getContent()).toBe(contents.unix);
    });

    it('Should throw if requested line is out of bounds', () => {
        let exception: Error = null;
        try {
            windowsTextFile.getLine(3);
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should throw if range to be replaced is out of bounds (line or column)', () => {
        let exception: Error = null;
        try {
            windowsTextFile.replaceRange({
                line: 100000000000000000,
                startCol: 1,
                endCol: 2,
                newText: 'anything. does not matter'
            });
        } catch (e) {
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
        } catch (e) {
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
        } catch (e) {
            exception = e;
        }
        expect(exception).not.toBe(null);
    });

    it('Should correctly replace line if bounds are OK', () => {
        windowsTextFile.replaceRange({
            line: 0,
            startCol: 4,
            endCol: 4,
            newText: ' weird '
        });
        expect(windowsTextFile.getContent()).toBe('Some weird line \r\n another line \r\n');
    });

    it('Should write to file-system, overwriting existing or not (user´s choice)', () => {
        windowsTextFile.write({
            overwrite: false
        });
        expect(fs.readFileSync(
            path.resolve(projectRoot, 'windowsTextFile.something'),
            'utf8'
        )).toBe('Some weird line \r\n another line \r\n');

        let exception: Error = null;
        try {
            windowsTextFile.write({
                overwrite: false
            });
        } catch (e) {
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
        expect(fs.readFileSync(
            path.resolve(projectRoot, 'windowsTextFile.something'),
            'utf8'
        )).toBe('Some really weird line \r\n another line \r\n');

        fs.removeSync(projectRoot);
    });
});
