import { IInternalPath } from '../../utils/i-internal-path';
import { ITextFile } from '../i-text-file';
import fs = require('fs-extra');


export class TextFile implements ITextFile {

    protected lineBreak: string;
    protected lines: string[];

    protected columnWithinBounds(column: number, line: string): boolean {
        return column < line.length && column >= 0;
    }

    protected lineNumberWithinBounds(lineNumber: number): boolean {
        return lineNumber >= 0 && lineNumber < this.lines.length;
    }

    /**
     * Throws if line is out of bounds
     */
    protected setLine(lineNumber: number, content: string) {
        if (!this.lineNumberWithinBounds(lineNumber)) {
            throw new Error(`Line number out of bounds`);
        }
        this.lines[lineNumber] = content;
    }

    constructor(
        protected path: IInternalPath,
        content: string,
    ) {
        this.lineBreak = content.match(/\r\n|\n/)[0] || '\n';
        this.lines = content.split(this.lineBreak);
    }

    public getContent(): string {
        return this.lines.join(this.lineBreak);
    }

    public getPath(): IInternalPath {
        return this.path;
    }

    /**
     * Throws if line is out of bounds
     */
    public getLine(lineNumber: number): string {
        if (!this.lineNumberWithinBounds(lineNumber)) {
            throw new Error(`Line number out of bounds`);
        }
        return this.lines[lineNumber];
    }

    /**
     * Throws if anything is out of bounds
     */
    public replaceRange(config: { line: number; startCol: number; endCol: number; newText: string }): void {
        let line = this.getLine(config.line);
        if (!this.columnWithinBounds(config.startCol, line) || !this.columnWithinBounds(config.endCol, line)) {
            throw new Error(`Attempted to access column out of bounds of line`);
        }
        this.setLine(
            config.line,
            line.substr(0, config.startCol) + config.newText + line.substr(config.endCol + 1)
        );
    }

    public write(config: { overwrite: boolean; }): void {
        if (!config.overwrite && fs.existsSync(this.path.toAbsolute().toString())) {
            throw new Error(`Attempted to write an already existent TextFile without overwrite flag`);
        }
        fs.createFileSync(this.path.toAbsolute().toString());
        fs.writeFileSync(
            this.path.toAbsolute().toString(),
            this.lines.join(this.lineBreak),
        );
    }
}
