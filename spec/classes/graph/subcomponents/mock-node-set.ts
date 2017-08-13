import { IRawNode } from '../../../../src/classes/graph/subcomponents/i-raw-node';
export let rawNodes: IRawNode[] = [{
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