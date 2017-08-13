"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jasmine" />
var inversify_config_1 = require("../../../../src/inversify.config");
var mock_node_set_1 = require("./mock-node-set");
var container = new inversify_config_1.ContainerBuilder().build();
var nodeFactory = container.get('INodeFactory');
var edgeFactory = container.get('IEdgeFactory');
var edgeSet = edgeFactory.createEdgeSet(nodeFactory.createNodeSet(mock_node_set_1.rawNodes));
describe('EdgeSet', function () {
    it('Should convert to Array', function () {
        expect(JSON.stringify(edgeSet.asArray()))
            .toBe('[{"from":1,"to":2},{"from":1,"to":3},{"from":1,"to":5},{"from":2,"to":1},{"from":2,"to":5}]');
    });
});
