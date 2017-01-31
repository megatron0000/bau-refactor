import { BauProject } from './bau-project';
import path = require('path');
import fs = require('fs-extra');

interface SourceWithDependencies {
    unresolved: string;
    path: string;
    line: number;
}

/**
 * It is designed to be always part of a BauProject
 * (hence the need for it in the constructor)
 */
export class BauSourceFile {

    protected sourceFile: ts.SourceFile;
    protected parentProject: BauProject;

    /**
     * Mimics typescript resolver
     * 
     * Throws if not found
     */
    protected resolveImport(rawPath: string): string {
        let importAbsPath = path.resolve(this.getAbsDir(), rawPath);

        // Do nothing if import is already well defined
        if (fs.existsSync(importAbsPath) && fs.statSync(importAbsPath).isFile() && path.extname(importAbsPath).match(/(\.ts)|(\.tsx)/)) {
            return rawPath; // Now we know it has extension
        }

        // Try to parse as file
        if (fs.existsSync(importAbsPath + '.ts')) {
            return rawPath + '.ts';
        }
        if (fs.existsSync(importAbsPath + '.tsx')) {
            return rawPath + '.timportAbsPathsx';
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
     * Throws Error if invalid arguments
     */
    constructor(source: ts.SourceFile, parentProject: BauProject) {
        if (!source || !parentProject) {
            throw new ReferenceError('BauSourceFile must be valid and be part of a BauProject');
        }
        this.sourceFile = source;
        this.parentProject = parentProject;
    }

    /**
     * Returns array of relative imports under rootNode.
     * 'Relative' means relative to file's directory
     * 
     * All imports are available in two forms: resolved (explicited) and unresolved (as is)
     */
    public getRelativeImports(): SourceWithDependencies[] {

        /**
         * Where imports gathered by 'traverse' are stored
         */
        let imports: SourceWithDependencies[] = [];

        /**
         * Collects relative imports below rootNode
         */
        let traverse = (rootNode: ts.Node) => {

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
                                path: (<ts.StringLiteral>subChild).text.replace(/['"]/g, ''),
                                line: ts.getLineAndCharacterOfPosition(this.sourceFile, subChild.pos).line
                            });
                        }
                    } else {
                        searchChild(subChild);
                    }
                });
            };

            ts.forEachChild(rootNode, (child) => {
                if (child.kind === ts.SyntaxKind.ImportDeclaration || child.kind === ts.SyntaxKind.ImportEqualsDeclaration) {
                    searchChild(child);
                } else {
                    traverse(child);
                }
            });
        };

        traverse(this.sourceFile);
        // Resolve implicit names (like index.ts) and add initial ./ if needed
        return imports.map(importt => ({
            path: this.resolveImport(importt.path),
            line: importt.line,
            unresolved: importt.unresolved
        })).map(importt => {
            if (!importt.path.match(/^(\.\/|\.\.\/)/)) {
                importt.path = './' + importt.path;
            }
            return importt;
        });
    };

    public getAbsPath() {
        return path.resolve(this.parentProject.getAbsPath(), this.sourceFile.fileName);
    }

    /**
     * Path relative to parent project's path
     */
    public getProjectRelativePath() {
        return path.relative(this.parentProject.getAbsPath(), this.getAbsPath());
    }

    /**
     * Absolute path of container directory
     */
    public getAbsDir() {
        return path.dirname(this.getAbsPath());
    }

    public getProjectRelativeDir() {
        return path.dirname(this.getProjectRelativePath());
    }



}
