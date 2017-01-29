"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var vis_1 = require("vis");
var GraphService = (function () {
    function GraphService() {
        this.defaultOptions = {
            edges: {
                arrows: 'to',
                color: {
                    hover: 'yellow',
                    color: 'black',
                    highlight: 'yellow'
                },
                smooth: true
            },
            layout: {
                hierarchical: {
                    enabled: false,
                    direction: 'LR',
                    sortMethod: 'directed',
                    levelSeparation: 200
                },
                improvedLayout: true,
                randomSeed: undefined
            },
            nodes: {
                shape: 'box',
                shadow: true
            },
            groups: {
                controller: {
                    color: '#2fe05e'
                },
                service: {
                    color: '#f74a67'
                },
                type: {
                    color: 'rgb(242,107,245)'
                },
                interface: {
                    color: '#abef23'
                },
                directive: {
                    color: '#7083c1'
                },
                unknown: {}
            },
            interaction: {
                // dragView: false,
                hover: true,
                navigationButtons: true,
                keyboard: true,
                multiselect: true,
                tooltipDelay: 1
            },
            configure: {
                // mostra todas as opções numa GUI ótima
                enabled: false
            }
        };
    }
    GraphService.prototype.reload = function () {
        this.visObj.destroy();
        this.visObj = new vis_1.Network(this.container, {
            nodes: new vis_1.DataSet(this.data.nodes),
            edges: new vis_1.DataSet(this.data.edges)
        }, this.options);
        console.log('Current seed', this.visObj.getSeed());
    };
    GraphService.prototype.setup = function (components) {
        this.container = components.container;
        this.data = {
            edges: components.data.edges,
            nodes: components.data.nodes
        };
        this.options = components.options || this.defaultOptions;
        this.visObj = new vis_1.Network(this.container, {
            nodes: new vis_1.DataSet(this.data.nodes),
            edges: new vis_1.DataSet(this.data.edges)
        }, this.options);
        console.log('Current seed', this.visObj.getSeed());
    };
    GraphService.prototype.switchVisibility = function (groupName) {
        var _this = this;
        function forEach(array, filter, callback) {
            var filteredArray = [];
            // Filtrar o array
            for (var i = 0; i < array.length; i++) {
                var elem = array[i];
                var passed = true;
                for (var key in filter) {
                    if (filter.hasOwnProperty(key)) {
                        if (typeof filter[key] === 'string') {
                            passed = new RegExp(filter[key]).test(elem[key]);
                        }
                        else {
                            passed = filter[key] === elem[key];
                        }
                        if (!passed) {
                            break;
                        }
                    }
                    else {
                        throw new Error('At least one element of the array does not possess the key: ' + key);
                    }
                }
                if (passed) {
                    filteredArray.push(elem);
                }
            }
            filteredArray.forEach(function (elem, index, array) {
                callback(elem, index, array);
            });
        }
        function find(array, filter) {
            for (var i = 0; i < array.length; i++) {
                var elem = array[i];
                var passed = true;
                for (var key in filter) {
                    if (filter.hasOwnProperty(key)) {
                        if (elem[key] !== filter[key]) {
                            passed = false;
                            break;
                        }
                    }
                    else {
                        throw new Error('At least one element of the array does not possess the key: ' + key);
                    }
                }
                if (passed) {
                    return elem;
                }
            }
        }
        this.options.groups[groupName].hidden = !this.options.groups[groupName].hidden;
        // CUIDADO !! this.data.edges é do tipo vis.DataSet
        // (observe o return de setupDom)
        forEach(this.data.edges, {
            group: groupName
        }, function (elem) {
            var fromGroupName = find(_this.data.nodes, {
                id: elem.from
            }).group;
            var toGroupName = find(_this.data.nodes, {
                id: elem.to
            }).group;
            if (!_this.options.groups[fromGroupName].hidden && !_this.options.groups[toGroupName].hidden) {
                elem.hidden = false;
            }
            else {
                elem.hidden = true;
            }
        });
        this.reload();
    };
    GraphService.prototype.setIsHierarchical = function () {
        this.options.layout.hierarchical.enabled = !this.options.layout.hierarchical.enabled;
        this.reload();
    };
    return GraphService;
}());
GraphService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], GraphService);
exports.GraphService = GraphService;
//# sourceMappingURL=graph.service.js.map