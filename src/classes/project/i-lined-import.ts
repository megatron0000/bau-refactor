import { IInternalPath } from '../utils/i-internal-path';
export interface ILinedImport {
    unresolved: string;
    resolved: IInternalPath;
    line: number;
    startCol: number;
    endCol: number;
}
