"use strict";
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
