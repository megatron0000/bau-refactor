"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawNodes = [{
        label: 'john',
        dependencies: ['lisa', 'mike', 'bob']
    }, {
        label: 'lisa',
        dependencies: ['john', 'bob']
    }, {
        label: 'mike',
        dependencies: []
    }, {
        label: 'stranger',
        dependencies: []
    }];
