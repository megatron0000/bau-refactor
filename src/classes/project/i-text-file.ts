import { IInternalPath } from '../utils/i-internal-path';
export interface ITextFile {
    getContent(): string;
    getPath(): IInternalPath;
    changePath(newPath: IInternalPath): void;
    getLine(lineNumber: number): string;
    replaceRange(config: { line: number; startCol: number; endCol: number; newText: string }): void;
    write(config: { overwrite: boolean; }): void;
}
