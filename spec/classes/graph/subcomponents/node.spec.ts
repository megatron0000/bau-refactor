/// <reference types="jasmine" />
import { ContainerBuilder } from '../../../../src/inversify.config';
import { INodeFactory } from '../../../../src/classes/graph/subcomponents/i-node-factory';
import { rawNodes } from './mock-node-set';

let container = new ContainerBuilder().build();

let nodeFactory = container.get<INodeFactory>('INodeFactory');



let nodeSet = nodeFactory.createNodeSet(rawNodes);

describe('NodeSet', () => {
    it('Should store nodes in order supplied, leaving unknown deps in final positions', () => {
        expect(nodeSet.byLabel('bob').id).toBe(5);
    });

    it('Should find by label', () => {
        let found = nodeSet.byLabel('john');
        expect(found.id).toBe(1);
        expect(found.dependencies.length).toBe(3);
        expect(found.label).toBe('john');
    });

    it('Should find by id (NOT zero-based)', () => {
        expect(nodeSet.byId(2).label).toBe('lisa');
    });

    it('Should be able to apply a callback to all nodes', () => {
        let output = '';
        nodeSet.forEach(node => output += node.label)
        expect(output).toBe('johnlisamikestrangerbob');
    });

    it('Should convert nodeSet to Array', () => {
        expect(JSON.stringify(nodeSet.asArray()))
            .toBe('[{"id":1,"label":"john","dependencies":["lisa","mike","bob"]},'
            + '{"id":2,"label":"lisa","dependencies":["john","bob"]},'
            + '{"id":3,"label":"mike","dependencies":[]},'
            + '{"id":4,"label":"stranger","dependencies":[]},'
            + '{"id":5,"label":"bob","dependencies":[]}]');
    });

});
