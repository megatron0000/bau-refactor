/// <reference types="jasmine" />
import { ContainerBuilder } from '../../../../src/inversify.config';
import { rawNodes } from './mock-node-set';
import { IEdgeFactory } from '../../../../src/classes/graph/subcomponents/i-edge-factory';
import { INodeFactory } from '../../../../src/classes/graph/subcomponents/i-node-factory';

let container = new ContainerBuilder().build();

let nodeFactory = container.get<INodeFactory>('INodeFactory');
let edgeFactory = container.get<IEdgeFactory>('IEdgeFactory');

let edgeSet = edgeFactory.createEdgeSet(nodeFactory.createNodeSet(rawNodes));


describe('EdgeSet', () => {
    it('Should convert to Array', () => {
        expect(JSON.stringify(edgeSet.asArray()))
            .toBe('[{"from":1,"to":2},{"from":1,"to":3},{"from":1,"to":5},{"from":2,"to":1},{"from":2,"to":5}]');
    });
});
