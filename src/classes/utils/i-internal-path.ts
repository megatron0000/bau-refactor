import { IAbsolutePath } from './i-absolute-path';
export interface IInternalPath {
    equals(other: IInternalPath): boolean;
    toAbsolute(): IAbsolutePath;
    toString(): string;
    join(...other: string[]): IInternalPath;
}
