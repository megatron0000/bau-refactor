import { BauImportService } from './bau-import-service';
import cp = require('child_process');
import readline = require('readline');
import path = require('path');
import fs = require('fs-extra');
import treet = require('treet');
import { BauDependencyGraph } from './graph/bau-dependency-graph';
import { BauProject } from './bau-project';
import { BauSourceFile } from './bau-source-file';

interface TextReplacement {
    line: number;
    original: RegExp;
    new: string;
}

interface FileReplacement {
    path: string;
    replacements: TextReplacement[];
}

interface ReplacedFileContent {
    path: string;
    content: string;
}

export class BauFileMover {
    protected dependencyGraph: BauDependencyGraph;
    protected project: BauProject;
    protected importService: BauImportService;

    constructor(project: BauProject, dependencyGraph: BauDependencyGraph) {
        this.dependencyGraph = dependencyGraph;
        this.project = project;
        this.importService = new BauImportService();
    }

    /**
     * Throws error if
     *  - fileName is not part of project
     *  - targetFileName is outside project
     *  - targetFileName already exists inside project
     *  - targetFileName is not a .ts file
     */
    public move(fileName: string, targetFileName: string): void {
        /**
         * Ensure OS-like paths
         */
        fileName = path.normalize(fileName);
        targetFileName = path.normalize(targetFileName);

        let source: BauSourceFile = this.project.pathToSource(fileName);
        let target = {
            relativePath: targetFileName,
            absPath: path.resolve(this.project.getAbsPath(), targetFileName)
        };

        /**
         * Inutilize arguments
         */
        fileName = undefined;
        targetFileName = undefined;

        /**
         * Throw if source does not exist in project
         */
        if (!source) {
            throw new ReferenceError(`File to be moved does not exist inside project`);
        }
        /**
         * Throw if destination is outside project
         */
        if (path.relative(
            this.project.getAbsPath(),
            target.absPath
        ).match(/\.\./)) {
            throw new ReferenceError(`Intended target cannot be outside of project`);
        }
        /**
         * Throw if destination already exists
         */
        if (fs.existsSync(target.absPath)) {
            throw new Error(`Intended target already exists.`);
        }
        /**
         * Throw if target is not a .ts file
         */
        if (!target.relativePath.match(/\.ts$/)) {
            throw new Error(`Intended target must be a .ts file`);
        }

        /**
         * Try to move first. If this fails, no text substitution must be done
         * 
         * Create intermediary dirs if necessary (writeFileSync does not do this)
         */
        fs.createFileSync(target.absPath);
        fs.writeFileSync(
            target.absPath,
            fs.readFileSync(source.getAbsPath())    // Buffer
        );

        /**
         * Function to make file text substitution easier (and reusable).
         * 
         * Does not write to file !!
         * 
         * Returns Promise with new content (all intended replacements done).
         * 
         * On error, Promise is rejected with due Error
         */
        let replace = (fileReplacement: FileReplacement): Promise<ReplacedFileContent> => {
            return new Promise((resolve, reject) => {
                try {
                    let newContent: string = '';
                    let readInterface = readline.createInterface({
                        input: fs.createReadStream(fileReplacement.path)
                    });
                    let lineCounter = 0;
                    readInterface.addListener('line', (line: string) => {
                        let currReplacement: TextReplacement;
                        if (currReplacement = fileReplacement.replacements.find(replacement => replacement.line === lineCounter)) {
                            newContent += line.replace(currReplacement.original, currReplacement.new) + '\n';
                        } else {
                            newContent += line + '\n';
                        }

                        lineCounter++;
                    });
                    readInterface.addListener('close', () => resolve({
                        path: fileReplacement.path,
                        content: newContent
                    }));
                } catch (e) {
                    reject(e);
                }
            });
        };

        /**
         * Uses above defined function, however effectively writes to intended files.
         * 
         * Resolves only if all substitutions went well.
         * 
         * In case any of them went wrong, rejects with due error
         */
        let replaceMultiple = (requests: FileReplacement[]): Promise<undefined> => {
            return Promise.all(requests.map(request => replace(request))).then((results => {
                for (let result of results) {
                    fs.writeFileSync(result.path, result.content);
                }
            }));
        };

        /**
         * Escapes a string to avoid RegExp metacharacters.
         * 
         * Example: quote('test.') === 'test\.'
         */
        let quote = (string: string) => (string + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');

        /**
         * Remember that BauDependencyGraph works with project-relative paths
         */
        let dependencies: BauSourceFile[] = this.dependencyGraph
            .getDependencies(source.getProjectRelativePath())
            .map(depPath => this.project.pathToSource(depPath));
        let dependents: BauSourceFile[] = this.dependencyGraph
            .getDependents(source.getProjectRelativePath())
            .map(depPath => this.project.pathToSource(depPath));

        /**
         * Build FileReplacement[]
         */
        let requests: FileReplacement[] = [];
        // Corrections in moved file
        requests.push({
            path: target.absPath,
            replacements: dependencies.map(dep => {
                // Find obj with .line, .unresolved and .path
                let importt = source
                    .getRelativeImports()
                    .find(importWithLine => !path.relative(
                        path.resolve(source.getAbsDir(), importWithLine.path),
                        dep.getAbsPath()
                    ));
                return {
                    line: importt.line,
                    original: new RegExp('(\'|")' + quote(importt.unresolved) + '(?:\'|")'),
                    new: '$1' + this.importService.buildLiteral(
                        target.absPath,
                        dep.getAbsPath()
                    ) + '$1'
                };
            })
        });
        // Corrections in depeendents of moved file. THEY MUST IMPORT ONLY ONCE
        for (let dependent of dependents) {
            let importt = dependent
                .getRelativeImports()
                .find(importWithLine => !path.relative(
                    path.resolve(dependent.getAbsDir(), importWithLine.path),
                    source.getAbsPath()
                ));
            requests.push({
                path: dependent.getAbsPath(),
                replacements: [{
                    line: importt.line,
                    original: new RegExp('(\'|")' + quote(importt.unresolved) + '(?:\'|")'),
                    new: '$1' + this.importService.buildLiteral(
                        dependent.getAbsPath(),
                        target.absPath
                    ) + '$1'
                }]
            });
        }

        /**
         * Finalize writing the import corrections and deleting original
         */
        console.log(treet(requests));
        replaceMultiple(requests)
            .then(() => {
                cp.execSync('rimraf ' + source.getAbsPath(), {
                    cwd: this.project.getAbsPath()
                });
                console.log('DONE');
            })
            .catch(e => {
                cp.execSync('rimraf ' + target.absPath, {
                    cwd: this.project.getAbsPath()
                });
                console.log(
                    `
                    ----------------------------------------------------
                    An error was found. Relax: No rewrite has been done.
                    Below, details of the error:
                    ----------------------------------------------------
                    `
                );
                console.error(e);
                process.exit(1);
            });

    }
}
