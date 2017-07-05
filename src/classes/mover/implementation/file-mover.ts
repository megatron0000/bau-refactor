import { IDependencyGraph } from '../../graph/i-dependency-graph';
import { IGraphFactory } from '../../graph/i-graph-factory';
import { IProject } from '../../project/i-project';
import { IProjectFactory } from '../../project/i-project-factory';
import { ISourceFile } from '../../project/i-source-file';
import { ITextFile } from '../../project/i-text-file';
import { IAbsolutePath } from 'strong-paths';
import { IImportService } from '../../utils/i-import-service';
import { IInternalPath } from 'strong-paths';
import { IPathService } from 'strong-paths';
import { IFileMover } from '../i-file-mover';
import fs = require('fs-extra');
import { inject, injectable } from 'inversify';
import path = require('path');

@injectable()
export class FileMover implements IFileMover {

    protected project: IProject;
    protected dependencyGraph: IDependencyGraph;

    constructor(
        @inject('IProjectFactory') projectFactory: IProjectFactory,
        @inject('IGraphFactory') graphFactory: IGraphFactory,
        @inject('IImportService') protected importService: IImportService,
        @inject('IPathService') protected pathService: IPathService
    ) {
        this.project = projectFactory.getSingletonProject();
        this.dependencyGraph = graphFactory.createGraph();
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
         * Not needed normalization
         */
        fileName = path.normalize(fileName);
        targetFileName = path.normalize(targetFileName);

        /**
         * Throw if source does not exist in project
         */
        let source: ISourceFile;
        try {
            source = this.project.pathToSource(this.pathService.createInternal(fileName));
        } catch (e) {
            e.message = `File ${fileName} is not a valid source file inside project`;
            throw e;
        }

        /**
         * Throw if source does not have supported extension
         */
        if (!source.getProjectRelativePath().toString().match(/(\.tsx?)$/)) {
            throw new Error(`File to be moved must be a .ts / .d.ts / .tsx file`);
        }

        /**
         * Throw if target does not exist in project
         */
        let target: { relativePath: IInternalPath; absPath: IAbsolutePath; textFile: ITextFile; };
        try {
            target = {
                relativePath: this.pathService.createInternal(targetFileName),
                absPath: this.pathService.createAbsolute(path.resolve(this.project.getAbsPath().toString(), targetFileName)),
                textFile: source.toTextFile()
            };
            target.textFile.changePath(target.relativePath);
        } catch (e) {
            e.message = `File ${targetFileName} is maybe a reference to outside the project ?`;
            throw e;
        }

        /**
         * Inutilize arguments
         */
        fileName = undefined;
        targetFileName = undefined;

        /**
         * Throw if destination already exists
         */
        if (fs.existsSync(target.absPath.toString())) {
            throw new Error(`Intended target already exists.`);
        }

        /**
         * Throw if target is not a .ts file
         */
        if (!target.relativePath.toString().match(/(\.tsx?)$/)) {
            throw new Error(`Intended target must be a .ts / .d.ts / .tsx file`);
        }

        /**
         * Correct dependencies within source
         */
        this.dependencyGraph.getDependencies(source.getProjectRelativePath())
            .map(dependencyPath => source.getRelativeImports().find(importt => importt.resolved.equals(dependencyPath)))
            .forEach(linedImport => {
                target.textFile.replaceRange({
                    line: linedImport.line,
                    startCol: linedImport.startCol,
                    endCol: linedImport.endCol,
                    newText: this.importService.buildLiteral(target.relativePath, linedImport.resolved)
                });
            });
        target.textFile.write({
            overwrite: false
        });

        /**
         * Correct dependents on source
         */
        this.dependencyGraph.getDependents(source.getProjectRelativePath())
            .map(dependentPath => this.project.pathToSource(dependentPath))
            .map(dependentSourceFile => ({
                textFile: dependentSourceFile.toTextFile(),
                linedImport: dependentSourceFile.getRelativeImports().find(
                    importt => importt.resolved.equals(source.getProjectRelativePath())
                )
            }))
            .forEach(dependent => {
                dependent.textFile.replaceRange({
                    line: dependent.linedImport.line,
                    startCol: dependent.linedImport.startCol,
                    endCol: dependent.linedImport.endCol,
                    newText: this.importService.buildLiteral(dependent.textFile.getPath(), target.relativePath)
                });
                dependent.textFile.write({
                    overwrite: true
                });
            });

        /**
         * Remove original file
         */
        fs.removeSync(source.getAbsPath().toString());

    }
}
