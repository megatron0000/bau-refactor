import { ITextFile } from '../i-text-file';
import { ITextFileFactory } from '../i-text-file-factory';
import { IInternalPath } from '../../utils/i-internal-path';
import { IPathService } from '../../utils/i-path-service';
import { ILinedImport } from '../i-lined-import';
import { ISourceFile } from '../i-source-file';
import { IProject } from '../i-project';
import fs = require('fs-extra');
import path = require('path');

/**
 * It is designed to be always part of a Project
 * (hence the need for it in the constructor)
 * 
 * NOT INJECTABLE
 */
export class SourceFile implements ISourceFile {

    protected sourceFile: ts.SourceFile;
    protected parentProject: IProject;
    protected pathService: IPathService;
    protected textFileFactory: ITextFileFactory;

    /**
     * Mimics typescript resolver. Returns POSIX paths
     * 
     * Throws if not found
     */
    protected __deprecated__resolveImport(rawPath: string): string {
        let importAbsPath = path.resolve(this.getAbsDir().toString(), rawPath);

        // Do nothing if import is already well defined
        if (fs.existsSync(importAbsPath) &&
            fs.statSync(importAbsPath).isFile() &&
            path.extname(importAbsPath).match(/(\.ts)|(\.tsx)/)) {
            return rawPath; // Now we know it has extension
        }

        // Try to parse as file
        if (fs.existsSync(importAbsPath + '.ts')) {
            return rawPath + '.ts';
        }
        if (fs.existsSync(importAbsPath + '.tsx')) {
            return rawPath + '.tsx';
        }
        if (fs.existsSync(importAbsPath + '.d.ts')) {
            return rawPath + '.d.ts';
        }

        // At this point, it must be a directory (does it exist at all ?)
        if (fs.existsSync(importAbsPath) && fs.statSync(importAbsPath).isDirectory()) {
            // Search for package.json and/or index.ts inside it
            let dirContents = fs.readdirSync(importAbsPath);
            let packageJson = dirContents.find(content => content === 'package.json');
            let packageContent: any;
            let indexTs = dirContents.find(content => content === 'index.ts');
            let indexTsx = dirContents.find(content => content === 'index.tsx');
            let indexDTs = dirContents.find(content => content === 'index.d.ts');
            if (packageJson) {
                packageContent = JSON.parse(fs.readFileSync(
                    path.resolve(importAbsPath, 'package.json'),
                    'utf8'
                ));
            }

            // No package || Yes package but No Typings
            if (!packageJson || (packageJson && !packageContent.typings)) {
                if (indexTs) {
                    return path.join(rawPath, 'index.ts').replace(/\\/g, '/');
                }
                if (indexTsx) {
                    return path.join(rawPath, 'index.tsx').replace(/\\/g, '/');
                }
                if (indexDTs) {
                    return path.join(rawPath, 'index.d.ts').replace(/\\/g, '/');
                }
            } else {
                return path.join(rawPath, packageContent.typings).replace(/\\/g, '/');
            }
        }
        // Problems...
        throw new ReferenceError(
            `Package ${rawPath}, imported by file ${this.getProjectRelativePath()}, has some oddity regarding its main file`
        );

    }

    /**
     * Deprecated version of this method used to return 
     * file-relative path of dependency. Now we want
     * project-relative path, hence the deprecation
     */
    protected resolveImport(rawPath: string): IInternalPath {
        // return this.pathService.createInternal(
        //     path.join(
        //         this.getProjectRelativeDir().toString(),
        //         this.__deprecated__resolveImport(rawPath)
        //     )
        // );
        return this.getProjectRelativeDir().join(
            this.__deprecated__resolveImport(rawPath)
        );
    }

    /**
     * Throws Error if invalid arguments
     */
    constructor(
        source: ts.SourceFile,
        parentProject: IProject,
        pathService: IPathService,
        textFileFactory: ITextFileFactory
    ) {
        if (!source || !parentProject) {
            throw new ReferenceError('BauSourceFile must be valid and be part of a BauProject');
        }
        this.sourceFile = source;
        this.parentProject = parentProject;
        this.pathService = pathService;
        this.textFileFactory = textFileFactory;
    }

    /**
     * Returns array of relative imports under rootNode.
     * 'Relative' means relative to file's directory
     * 
     * All imports are available in two forms: resolved (explicited) and unresolved (as is)
     */
    public getRelativeImports(): ILinedImport[] {

        /**
         * Where imports gathered by 'traverse' are stored
         */
        let imports: ILinedImport[] = [];

        /**
         * Collects relative imports below rootNode (which must be a ts.SourceFile)
         */
        let traverse = (rootNode: ts.Node) => {

            let originSourceFile = rootNode;

            /**
             * 'pos' is position from the first character
             * of the file (default used by typescript).
             * 
             * We want a column starting from the beginning 
             * of the line
             */
            let computeColOfPosition = (pos: number, sourceFile: ts.SourceFile) => {
                let starts = ts.computeLineStarts(sourceFile.getFullText(sourceFile));
                let lineStart: number;
                for (let start of starts) {
                    if (start <= pos) {
                        lineStart = start;
                    } else {
                        break;
                    }
                }
                return pos - lineStart;
            };

            let __traverse = (node: ts.Node) => {
                /**
                 * Searches inside a node to find a StringLiteral.
                 * 
                 * Must only be used if 'c' (argument) is an IMPORT STATEMENT
                 */
                let searchChild = (c: ts.Node) => {
                    ts.forEachChild(c, subChild => {
                        if (subChild.kind === ts.SyntaxKind.StringLiteral) {
                            if ((<ts.StringLiteral>subChild).text.replace(/["']/g, '').match(/^(?:(\.\/)|(\.\.\/))/)) {
                                imports.push({
                                    unresolved: (<ts.StringLiteral>subChild).text.replace(/['"]/g, ''),
                                    resolved: undefined,
                                    line: ts.getLineAndCharacterOfPosition(this.sourceFile, subChild.pos).line,
                                    startCol: computeColOfPosition(
                                        subChild.getStart(originSourceFile as ts.SourceFile),
                                        originSourceFile as ts.SourceFile
                                    ) + 1, // Avoid catching initial comma
                                    endCol: computeColOfPosition(
                                        subChild.getEnd(),
                                        originSourceFile as ts.SourceFile
                                    ) - 2   // Notice correction here (-2) to avoid semicolon and end comma
                                });
                            }
                        } else {
                            searchChild(subChild);
                        }
                    });
                };

                ts.forEachChild(node, (child) => {
                    if (child.kind === ts.SyntaxKind.ImportDeclaration || child.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                        searchChild(child);
                    } else {
                        __traverse(child);
                    }
                });
            };

            __traverse(rootNode);

        };

        traverse(this.sourceFile);
        // Resolve implicit names (like index.ts)
        return imports.map(importt => ({
            resolved: this.resolveImport(importt.unresolved),
            line: importt.line,
            unresolved: importt.unresolved,
            startCol: importt.startCol,
            endCol: importt.endCol
        }));
    };

    public toTextFile(): ITextFile {
        return this.textFileFactory.create({
            content: this.sourceFile.getFullText(this.sourceFile),
            path: this.getProjectRelativePath()
        });
    }

    public getAbsPath() {
        return this.parentProject
            .getAbsPath()
            .toInternal()
            .join(this.sourceFile.fileName)
            .toAbsolute();
    }

    /**
     * Path relative to parent project's path
     */
    public getProjectRelativePath() {
        return this.getAbsPath().toInternal();
    }

    /**
     * Absolute path of container directory
     */
    public getAbsDir() {
        return this.pathService.createAbsolute(
            path.dirname(this.getAbsPath().toString())
        );
    }

    public getProjectRelativeDir() {
        return this.pathService.createInternal(
            path.dirname(this.getProjectRelativePath().toString())
        );
    }



}
