"use strict";
var BauEdgeSet = (function () {
    function BauEdgeSet(nodeSet) {
        var _this = this;
        this.edgeArray = [];
        try {
            /**
             * Add an edge for each node-dependency pair from 'nodeSet'
             */
            nodeSet.forEach(function (node) {
                node.dependencies.forEach(function (dependencyLabel) {
                    _this.edgeArray.push({
                        from: node.id,
                        to: nodeSet.byLabel(dependencyLabel).id
                    });
                });
            });
        }
        catch (e) {
            throw new Error("While trying to build a BauEdgeSet, the following happened:\n                " + e.message);
        }
    }
    /**
     * Weaker representation.
     *
     * The array is a clone (does NOT hold same object references)
     */
    BauEdgeSet.prototype.asArray = function () {
        return JSON.parse(JSON.stringify(this.edgeArray));
    };
    return BauEdgeSet;
}());
exports.BauEdgeSet = BauEdgeSet;
