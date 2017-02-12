#!/usr/bin/env node

/**
 * NOTE: At time of execution, this will be at root/build/cli , NOT HERE
 */

import fs = require('fs-extra');
import cp = require('child_process');
import path = require('path');

// At runtime, we will be at @root/build/src/cli
let projectBase = path.resolve(__dirname, '../../../');

/**
 * Generate Typescript in src/html/**
 * 
 * It is configured to output in build/src/html
 */
cp.execSync('tsc', {
    cwd: path.resolve(projectBase, 'src/html')
});

/**
 * Move css, html files (from src/html)
 * that tsc will not touch
 */
function resourceCopy(absPath: string) {

    function convertToBuild(src: string) {
        return src.replace(/src(\\|\/)html/, 'build$1src$1html');
    }

    /**
     * - If it is node_modules
     * - Else, if it is root/something .js | .html | .css | .json (except karma, tslint, tsconfig, protractor)
     * - Else, if it is 'src/html/database' directory
     * - Else, if it is .html | .css inside src/html/app directory
     */
    if (absPath.match(/(node_modules)$/)) {
        // fs.copySync(absPath, convertToBuild(absPath));
    } else if (absPath.match(
        /src(\\|\/)html(\\|\/)(?!\\|\/|(tsconfig)|(tslint)|(karma)|(protractor))+?.*((\.js)|(\.json)|(\.html)|(\.css))$/
    )) {
        fs.copySync(absPath, convertToBuild(absPath));
    } else if (absPath.match(/src(\\|\/)html(\\|\/)(database)$/)) {
        fs.copySync(absPath, convertToBuild(absPath));
    } else if (absPath.match(/src(\\|\/)html(\\|\/)app.*$/)) {
        if (fs.statSync(absPath).isDirectory()) {
            fs.readdirSync(absPath)
                .map(relative => path.resolve(absPath, relative))
                .forEach(path => resourceCopy(path));
        } else if (absPath.match(/src(\\|\/)html(\\|\/)app.+?((\.html)|(.css))$/)) {
            fs.copySync(absPath, convertToBuild(absPath));
        }
    }
}
fs.readdirSync(path.resolve(projectBase, 'src/html'))
    .map(relative => path.resolve(projectBase, 'src/html', relative))
    .forEach(absPath => resourceCopy(absPath));

/**
 * npm install inside build/html folder
 */
cp.execSync('npm install --production', {
    cwd: path.resolve(projectBase, 'build/src/html')
});

