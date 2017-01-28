import { BauProject } from './bau-project';
import path = require('path');

/**
 * It is designed to be always part of a BauProject
 * (hence the need for it in the constructor)
 */
export class BauSourceFile {

    protected sourceFile: ts.SourceFile;
    protected parentProject: BauProject;

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
     * 
     * 'Relative' means relative to file's directory
     */
    public getRelativeImports() {

        /**
         * Where imports gathered by 'traverse' are stored
         */
        let imports: Array<{
            path: string,
            line: number
        }> = [];

        /**
         * Collects relative imports below rootNode
         */
        let traverse = (rootNode: ts.Node) => {
            ts.forEachChild(rootNode, (child) => {
                if (child.kind === ts.SyntaxKind.ImportDeclaration) {
                    ts.forEachChild(child, subChild => {
                        if (subChild.kind === ts.SyntaxKind.StringLiteral &&
                            (<ts.StringLiteral>subChild).text.replace(/["']/g, '').match(/^(?:(\.\/)|(\.\.\/))/)) {
                            imports.push({
                                path: (<ts.StringLiteral>subChild).text.replace(/['"]/g, ''),
                                line: ts.getLineAndCharacterOfPosition(this.sourceFile, subChild.pos).line
                            });
                        }
                    });
                } else {
                    traverse(child);
                }
            });
        };

        traverse(this.sourceFile);
        return imports;
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
     * Absolute absolute path of container directory
     */
    public getAbsDir() {
        return path.dirname(this.getAbsPath());
    }

    public getProjectRelativeDir() {
        return path.dirname(this.getProjectRelativePath());
    }



}
