import { IInternalPath } from 'strong-paths';
export interface ILinedImport {
    unresolved: string;
    resolved: IInternalPath;
    line: number;
    startCol: number;
    endCol: number;
}
