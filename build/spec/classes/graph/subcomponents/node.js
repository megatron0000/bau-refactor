"use strict";
/// <reference types="jasmine" />
var inversify_config_1 = require("../../../../src/inversify.config");
var container = new inversify_config_1.ContainerBuilder().build();
var nodeFactory = container.get('INodeFactory');
var rawNodes = [{
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
var nodeSet = nodeFactory.createNodeSet(rawNodes);
describe('NodeSet', function () {
    it('Should store nodes in order supplied, leaving unknown deps in final positions', function () {
        expect(nodeSet.byLabel('bob').id).toBe(4);
    });
    it('Should find by label', function () {
        var found = nodeSet.byLabel('john');
        expect(found.id).toBe(0);
        expect(found.dependencies.length).toBe(3);
        expect(found.label).toBe('john');
    });
    it('Should find by id', function () {
        expect(nodeSet.byId(1).label).toBe('lisa');
    });
});
