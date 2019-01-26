"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AlignmentTools = /** @class */ (function () {
    function AlignmentTools(canvas) {
        this.canvas = canvas;
    }
    AlignmentTools.prototype.left = function () {
        var _this = this;
        var activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            var activeObjectLeft_1 = -(activeObject.width / 2);
            activeObject.forEachObject(function (obj) {
                obj.set({
                    left: activeObjectLeft_1,
                });
                obj.setCoords();
                _this.canvas.renderAll();
            });
        }
    };
    AlignmentTools.prototype.center = function () {
        var _this = this;
        var activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            activeObject.forEachObject(function (obj) {
                obj.set({
                    left: 0 - ((obj.width * obj.scaleX) / 2),
                });
                obj.setCoords();
                _this.canvas.renderAll();
            });
        }
    };
    AlignmentTools.prototype.right = function () {
        var _this = this;
        var activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            var activeObjectLeft_2 = (activeObject.width / 2);
            activeObject.forEachObject(function (obj) {
                obj.set({
                    left: activeObjectLeft_2 - (obj.width * obj.scaleX),
                });
                obj.setCoords();
                _this.canvas.renderAll();
            });
        }
    };
    return AlignmentTools;
}());
exports.default = AlignmentTools;
