"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jasmine" />
var inversify_config_1 = require("../../../../src/inversify.config");
var mock_node_set_1 = require("./mock-node-set");
var container = new inversify_config_1.ContainerBuilder().build();
var nodeFactory = container.get('INodeFactory');
var nodeSet = nodeFactory.createNodeSet(mock_node_set_1.rawNodes);
describe('NodeSet', function () {
    it('Should store nodes in order supplied, leaving unknown deps in final positions', function () {
        expect(nodeSet.byLabel('bob').id).toBe(5);
    });
    it('Should find by label', function () {
        var found = nodeSet.byLabel('john');
        expect(found.id).toBe(1);
        expect(found.dependencies.length).toBe(3);
        expect(found.label).toBe('john');
    });
    it('Should find by id (NOT zero-based)', function () {
        expect(nodeSet.byId(2).label).toBe('lisa');
    });
    it('Should be able to apply a callback to all nodes', function () {
        var output = '';
        nodeSet.forEach(function (node) { return output += node.label; });
        expect(output).toBe('johnlisamikestrangerbob');
    });
    it('Should convert nodeSet to Array', function () {
        expect(JSON.stringify(nodeSet.asArray()))
            .toBe('[{"id":1,"label":"john","dependencies":["lisa","mike","bob"]},'
            + '{"id":2,"label":"lisa","dependencies":["john","bob"]},'
            + '{"id":3,"label":"mike","dependencies":[]},'
            + '{"id":4,"label":"stranger","dependencies":[]},'
            + '{"id":5,"label":"bob","dependencies":[]}]');
    });
});
