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
var graph_service_1 = require("../services/graph.service");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var GraphComponent = (function () {
    function GraphComponent(graphService, http) {
        this.graphService = graphService;
        this.http = http;
    }
    GraphComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.http.get('database/dependency-map.json')
            .map(function (result) { return result.json() || {}; })
            .toPromise()
            .then(function (response) {
            /**
             * Response has .nodes and .edges
             *
             * We don't supply options so we will get defaults
             */
            response.nodes = (response.nodes)
                .map(function (node) { return ({
                id: node.id,
                label: (node.label).split('\\').pop(),
                title: node.label
            }); });
            _this.graphService.setup({
                container: document.getElementById('mynetwork'),
                data: response
            });
        })
            .catch(function (error) {
            console.log('Loading or later processing of ./out.json failed');
            console.error(error);
        });
    };
    GraphComponent.prototype.setIsHierarchical = function () {
        this.graphService.setIsHierarchical();
    };
    return GraphComponent;
}());
GraphComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'graph',
        templateUrl: 'graph.component.html',
        styleUrls: ['graph.component.css'],
        providers: [graph_service_1.GraphService]
    }),
    __metadata("design:paramtypes", [graph_service_1.GraphService,
        http_1.Http])
], GraphComponent);
exports.GraphComponent = GraphComponent;
//# sourceMappingURL=graph.component.js.map