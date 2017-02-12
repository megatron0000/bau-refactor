"use strict";
var EdgeSet = (function () {
    function EdgeSet(nodeSet) {
        var _this = this;
        this.edgeArray = [];
        try {
            /**
             * Add an edge for each node-dependency pair from 'nodeSet'
             */
            nodeSet.asArray().forEach(function (node) {
                node.dependencies.forEach(function (dependencyLabel) {
                    _this.edgeArray.push({
                        from: node.id,
                        to: nodeSet.byLabel(dependencyLabel).id
                    });
                });
            });
        }
        catch (e) {
            throw new Error("While trying to build a EdgeSet, the following happened:\n                " + e.message);
        }
    }
    /**
     * Weaker representation.
     *
     * The array is a clone (does NOT hold same object references)
     */
    EdgeSet.prototype.asArray = function () {
        return JSON.parse(JSON.stringify(this.edgeArray));
    };
    return EdgeSet;
}());
exports.EdgeSet = EdgeSet;
