import { IInternalPath } from './i-internal-path';
export interface IAbsolutePath {
    equals(other: IAbsolutePath): boolean;
    toInternal(): IInternalPath;
    toString(): string;
}
