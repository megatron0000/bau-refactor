"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var BauNodeSet = (function () {
    /**
     * See interface BauNode for clarification.
     *
     * It is not necessary for all dependencies to be present
     * in the array.
     */
    function BauNodeSet(sourceNodes) {
        var _this = this;
        this.idCount = 0;
        /**
         * 'label's and 'id's must be unique
         *
         * It is not necessary for all declared dependencies to be
         * present inside the array
         */
        this.nodeArray = [];
        var newNodes = sourceNodes;
        /**
         * Flatten dependencies, without worrying
         * about producing duplication
         */
        sourceNodes.forEach(function (node) {
            newNodes = newNodes.concat(node.dependencies.map(function (old) { return ({ label: old, dependencies: [] }); }));
        });
        /**
         * Remove duplication.
         *
         * Observe it is important to maintain the lowest index copy of everycc
         * element, since only these possess the original 'dependencies' array
         */
        var accumulatedLabels = [];
        newNodes = newNodes.filter(function (node) {
            if (!accumulatedLabels.find(function (label) { return label === node.label; })) {
                accumulatedLabels.push(node.label);
                return true;
            }
            return false;
        });
        /**
         * Finally, insert id's
         */
        this.nodeArray = newNodes.map(function (node) { return (__assign({ id: ++_this.idCount }, node)); });
    }
    /**
     * Get a node by its unique id
     *
     * Throws Error if not present
     */
    BauNodeSet.prototype.byId = function (id) {
        var found = this.nodeArray.find(function (node) { return node.id === id; });
        if (!found) {
            throw new Error("No node with id " + id + " exists in this BauNodeSet");
        }
        return found;
    };
    /**
     * Get a node by its unique label
     *
     * Throws Error if not present
     */
    BauNodeSet.prototype.byLabel = function (label) {
        var found = this.nodeArray.find(function (node) { return node.label === label; });
        if (!found) {
            throw new Error("No node with label " + label + " exists in this BauNodeSet");
        }
        return found;
    };
    /**
     * Utility to iterate over all nodes of this BauNodeSet instance,
     * since there is no other way to access all them.
     */
    BauNodeSet.prototype.forEach = function (callback) {
        this.nodeArray.forEach(callback);
    };
    /**
     * Weaker representation
     *
     * The array is a clone (does NOT hold same object references)
     */
    BauNodeSet.prototype.asArray = function () {
        return JSON.parse(JSON.stringify(this.nodeArray));
    };
    return BauNodeSet;
}());
exports.BauNodeSet = BauNodeSet;
