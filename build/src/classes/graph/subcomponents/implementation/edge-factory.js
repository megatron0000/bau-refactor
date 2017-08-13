"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var edge_set_1 = require("./edge-set");
var inversify_1 = require("inversify");
var EdgeFactory = (function () {
    function EdgeFactory() {
    }
    EdgeFactory.prototype.createEdgeSet = function (nodeSet) {
        return new edge_set_1.EdgeSet(nodeSet);
    };
    EdgeFactory = __decorate([
        inversify_1.injectable()
    ], EdgeFactory);
    return EdgeFactory;
}());
exports.EdgeFactory = EdgeFactory;
