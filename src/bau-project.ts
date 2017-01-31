import fs = require('fs');
import path = require('path');
import { BauSourceFile } from './bau-source-file';
import * as ts from 'ntypescript';

/**
 * IGNORES node_modules. This is done inside this.findFilePaths()
 */
export class BauProject {
    protected absolutePath: string;
    protected sourceFiles: BauSourceFile[];
    // protected compilerOptions: ts.CompilerOptions;

    /**
     * Get all .ts files under the project and return an array
     * of their paths relative to root folder.
     * 
     * Throws Error if IO goes wrong somewhere
     * 
     * IGNORES node_modules
     */
    protected findFilePaths() {
        let output: string[] = [];

        /**
         * 'directory' must contain only absolute paths
         */
        let helperFunction = (directory: string) => {
            /**
             * Get content[] of input directory. Note we .map()
             * all paths to absolute
             */
            let paths = fs.readdirSync(directory).map(file => path.resolve(directory, file));
            /**
             * If is a '.ts' file, add it to output.
             * Else, if it is a directory, recurse over it
             */
            paths.forEach(pathElement => {
                let stat = fs.statSync(pathElement);
                if (stat.isFile() && path.extname(pathElement) === '.ts') {
                    output.push(pathElement);
                } else if (stat.isDirectory()) {
                    helperFunction(pathElement);
                }
            });
        };

        helperFunction(this.absolutePath);
        /**
         * Convert to paths relative to root folder and
         * ignore node_modules
         */
        return output.map(file => path.relative(this.absolutePath, file)).filter(file => !file.match(/node_modules/));
    }


    /**
     * Assumes project is on cwd(). Nothing else is permitted
     * 
     * Throws error if dir does not exist or if
     * it is not a dir (maybe it is a file) or if it
     * does not contain 'tsconfig.json'
     */
    constructor() {
        let projectRoot = process.cwd();

        if (!fs.existsSync(projectRoot) ||
            !fs.statSync(projectRoot).isDirectory() ||
            !fs.readdirSync(projectRoot).find(file => file === 'tsconfig.json')) {
            throw new ReferenceError(`
                Something wrong with folder specified as root. 
                Either isn't a directory, or doesn't exist, or doesn't contain a tsconfig.json
                `
            );
        }

        // Maybe cwd() already is absolute path, which means path.resolve() is unnecessary
        this.absolutePath = path.resolve(projectRoot);
        this.sourceFiles = this.getBauSources();
    }

    /**
     * Uses this.findFilePaths()
     * 
     * Will Throw Error if IO fails somewhere
     */
    public getBauSources() {
        /**
         * Be smart and return what has already been built
         */
        if (this.sourceFiles) {
            return this.sourceFiles;
        }
        /**
         * Paths supplied to ts.createProgram must be relative to project root
         * 
         * Program is created with some external libraries included. We don't
         * want this, so we filter them out
         */
        return ts.createProgram(this.findFilePaths(), ts.defaultInitCompilerOptions)
            .getSourceFiles()
            .filter(sourceFile => !sourceFile.fileName.match(/node_modules/))
            .map(sourceFile => new BauSourceFile(sourceFile, this));
    }

    /**
     * Accepts only a project-relative fileName
     * 
     * Is smart enough to normalize path beforehand
     */
    public pathToSource(fileName: string) {
        return this.getBauSources().find(source => !path.relative(
            source.getAbsPath(),
            path.resolve(this.getAbsPath(), fileName)
        ));
    }

    /**
     * Project´s absolute path (coincides with cwd() of the time of the creation of the project)
     */
    public getAbsPath() {
        return this.absolutePath;
    }
}
