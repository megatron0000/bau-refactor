import { BauEdgeSet } from './bau-edge-set';
import { BauNodeSet } from './bau-node-set';
import { BauProject } from './bau-project';
import fs = require('fs');
import path = require('path');



/**
 * Program itself
 */
// let file = path.resolve(__dirname, 'typescript-hero', 'src', 'IoC.ts');
// let sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.ES5, true);
// console.log(sourceFile.fileName);

let project = new BauProject();
let nodes = project.getBauSources().map(source => ({
    label: source.getProjectRelativePath(),
    dependencies: source.getRelativeImports()
        // do not care about line
        .map(importt => importt.path)
        // convert to root-relative path
        .map(fileRelative => path.join(source.getProjectRelativeDir(), fileRelative))
        // add .ts extension, or resolve to 'index.ts' inside a folder
        .map(noExtension => {
            // Try to parse as a file
            if (fs.existsSync(path.resolve(project.getAbsPath(), noExtension + '.ts'))) {
                return noExtension + '.ts';
            }
            // Then, knowing it is a directory, search for package.json and/or index.ts inside it
            let dirContents = fs.readdirSync(path.resolve(project.getAbsPath(), noExtension));
            let packageJson = dirContents.find(content => content === 'package.json');
            let indexTs = dirContents.find(content => content === 'index.ts');
            // No package but Yes index
            if (!packageJson && indexTs) {
                return path.join(noExtension, 'index.ts');
            }
            // Yes package AND Yes .main
            if (packageJson) {
                let packageContent = JSON.parse(fs.readFileSync(
                    path.resolve(project.getAbsPath(), noExtension, 'package.json'),
                    'utf8'
                ));
                if (packageContent.main) {
                    return path.join(noExtension, packageContent.main.replace(/(.js)$/, '.ts'));
                }
            }
            // Either (No package No index) or (Yes package No .main)
            throw new ReferenceError(`Package ${noExtension} has some oddity regarding its main file`);
        })
}));


let nodeSet: BauNodeSet;
let edgeSet: BauEdgeSet;

nodeSet = new BauNodeSet(nodes);
edgeSet = new BauEdgeSet(nodeSet);

console.log('nodes', nodes);
console.log('BauNodeSet', nodeSet);
console.log('BauEdgeSet', edgeSet);

fs.writeFileSync('./out.json', JSON.stringify({
    nodes: nodeSet.asArray(),
    edges: edgeSet.asArray()
}));

export = BauProject;


/**
 * END
 */


// let options = ts.convertCompilerOptionsFromJson(JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')).compilerOptions,
//     __dirname,
//     'tsconfig.json');


// ts.parseJsonConfigFileContent(JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')), )

// let program = ts.createProgram([file], options.options);
// console.log(ts.preProcessFile(fs.readFileSync(file, 'utf8')).importedFiles.map(file => file.fileName));


