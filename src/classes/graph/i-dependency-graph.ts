export interface IDependencyGraph {
    getDependents(fileName: string): string[];
    getDependencies(fileName: string): string[];
}
