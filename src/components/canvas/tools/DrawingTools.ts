import { fabric } from 'fabric';
import uuid from 'uuid/v4';

import Tools, { ITools } from './Tools';
import { IStaticCircle, IStaticLine, IStaticPolygon } from '../Canvas';

export interface IPolygon {
    initDraw?(): void;
    finishDraw?(): void;
    addPoint?(opt: fabric.IEvent): void;
    generatePolygon?(pointArray: IStaticCircle[]): void;
    createResize?(): void;
    removeResize?(): void;
    movingResize?(): void;
}

export interface ILine {

}

export interface IDrawingTools extends ITools {
    pointArray?: IStaticCircle[];
    lineArray?: IStaticLine[];
    activeLine?: IStaticLine;
    activeShape?: IStaticPolygon;
    polygon?: IPolygon;
    line?: ILine;
}

class DrawingTools extends Tools implements IDrawingTools {
    pointArray?: IStaticCircle[];
    lineArray?: IStaticLine[];
    activeLine?: IStaticLine;
    activeShape?: IStaticPolygon;

    polygon: IPolygon = {
        initDraw: () => {
            this.canvas.modeTools.drawing();
            this.pointArray = [];
            this.lineArray = [];
            this.activeLine = null;
            this.activeShape = null;
        },
        finishDraw: () => {
            this.pointArray.forEach((point) => {
                this.canvas.remove(point);
            });
            this.lineArray.forEach((line) => {
                this.canvas.remove(line);
            });
            this.canvas.remove(this.activeLine);
            this.canvas.remove(this.activeShape);
            this.pointArray = [];
            this.lineArray = [];
            this.activeLine = null;
            this.activeShape = null;
            this.canvas.renderAll();
            this.canvas.modeTools.selection();
        },
        addPoint: (opt: fabric.IEvent) => {
            const id = uuid();
            const { e, absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                id,
                radius: 3,
                fill: '#ffffff',
                stroke: '#333333',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            });
            if (!this.pointArray.length) {
                circle.set({
                    fill: 'red',
                });
            }
            const points = [x, y, x, y];
            const line = new fabric.Line(points, {
                strokeWidth: 2,
                fill: '#999999',
                stroke: '#999999',
                class: 'line',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            if (this.activeShape) {
                const position = this.canvas.getPointer(e);
                const activeShapePoints = this.activeShape.get('points');
                activeShapePoints.push({
                    x: position.x,
                    y: position.y,
                });
                const polygon = new fabric.Polygon(activeShapePoints, {
                    stroke: '#333333',
                    strokeWidth: 1,
                    fill: '#cccccc',
                    opacity: 0.1,
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                });
                this.canvas.remove(this.activeShape);
                this.canvas.add(polygon);
                this.activeShape = polygon;
                this.canvas.renderAll();
            } else {
                const polyPoint = [{ x, y }];
                const polygon = new fabric.Polygon(polyPoint, {
                    stroke: '#333333',
                    strokeWidth: 1,
                    fill: '#cccccc',
                    opacity: 0.1,
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                });
                this.activeShape = polygon;
                this.canvas.add(polygon);
            }
            this.activeLine = line;
            this.pointArray.push(circle);
            this.lineArray.push(line);
            this.canvas.add(line);
            this.canvas.add(circle);
        },
        generatePolygon: (pointArray) => {
            const points = [];
            const id = uuid();
            pointArray.forEach((point) => {
                points.push({
                    x: point.left,
                    y: point.top,
                });
                this.canvas.remove(point);
            });
            this.lineArray.forEach((line) => {
                this.canvas.remove(line);
            });
            this.canvas.remove(this.activeShape).remove(this.activeLine);
            const option = {
                id,
                points,
                type: 'polygon',
                stroke: 'rgba(0, 0, 0, 1)',
                strokeWidth: 3,
                strokeDashArray: [10, 5],
                fill: 'rgba(0, 0, 0, 0.25)',
                opacity: 1,
                objectCaching: !this.editable,
                name: 'New polygon',
                superType: 'DRAWING',
            };
            this.canvas.generalTools.add(option, false);
            this.pointArray = [];
            this.activeLine = null;
            this.activeShape = null;
            this.canvas.modeTools.selection();
        },
        // TODO... polygon resize
        createResize: (target, points) => {
            points.forEach((point, index) => {
                const { x, y } = point;
                const circle = new fabric.Circle({
                    name: index,
                    radius: 3,
                    fill: '#ffffff',
                    stroke: '#333333',
                    strokeWidth: 0.5,
                    left: x,
                    top: y,
                    hasBorders: false,
                    hasControls: false,
                    originX: 'center',
                    originY: 'center',
                    hoverCursor: 'pointer',
                    parentId: target.id,
                });
                this.pointArray.push(circle);
            });
            const group = [target].concat(this.pointArray);
            this.canvas.add(new fabric.Group(group, { type: 'polygon', id: uuid() }));
        },
        removeResize: () => {
            if (this.pointArray) {
                this.pointArray.forEach((point) => {
                    this.canvas.remove(point);
                });
                this.pointArray = [];
            }
        },
        movingResize: (target, e) => {
            const points = target.diffPoints || target.points;
            const diffPoints = [];
            points.forEach((point) => {
                diffPoints.push({
                    x: point.x + e.movementX,
                    y: point.y + e.movementY,
                });
            });
            target.set({
                diffPoints,
            });
            this.canvas.renderAll();
        },
    };

    line: ILine = {
    };
}

export default DrawingTools;
