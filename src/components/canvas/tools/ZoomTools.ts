import { ITools } from './Tools';
import { IStaticCanvas, IWorkareaOption, IStaticObject } from '../Canvas';

export interface IZoomTools extends ITools {
    zoomToPoint(point: fabric.Point| any, zoom: number): void;
    zoomOneToOne(): void;
    zoomToFit(): void;
    zoomIn(): void;
    zoomOut(): void;
}

class ZoomTools implements IZoomTools {
    canvas: IStaticCanvas;
    workarea: IWorkareaOption;
    minZoom: number;
    maxZoom: number;
    onZoom: any;

    constructor(canvas: IStaticCanvas, workarea: IWorkareaOption,
        minZoom: number, maxZoom: number, onZoom: any) {
        this.canvas = canvas;
        this.workarea = workarea;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.onZoom = onZoom;
    }

    zoomToPoint(point: fabric.Point | any, zoom: number) {
        const { onZoom, minZoom, maxZoom } = this;
        let zoomRatio = zoom;
        if (zoom <= (minZoom / 100)) {
            zoomRatio = minZoom / 100;
        } else if (zoom >= (maxZoom / 100)) {
            zoomRatio = maxZoom / 100;
        }
        this.canvas.zoomToPoint(point, zoomRatio);
        this.canvas.getObjects().forEach((obj: IStaticObject) => {
            if (this.canvas.elementTools.isElementType(obj.type)) {
                const width = obj.width * obj.scaleX * zoomRatio;
                const height = obj.height * obj.scaleY * zoomRatio;
                const el = this.canvas.elementTools.findById(obj.id);
                // update the element
                this.canvas.elementTools.setSize(el, width, height);
                const { left, top } = obj.getBoundingRect();
                this.canvas.elementTools.setPosition(el, left, top);
                if (obj.type === 'video' && obj.player) {
                    obj.player.setPlayerSize(width, height);
                }
            }
        });
        if (onZoom) {
            onZoom(zoomRatio);
        }
    }

    zoomOneToOne() {
        const center = this.canvas.getCenter();
        const point = {
            x: center.left,
            y: center.top,
        };
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.zoomToPoint(point, 1);
    }

    zoomToFit() {
        let scaleX;
        let scaleY;
        scaleX = this.canvas.getWidth() / this.workarea.width;
        scaleY = this.canvas.getHeight() / this.workarea.height;
        if (this.workarea.height > this.workarea.width) {
            scaleX = scaleY;
            if (this.canvas.getWidth() < this.workarea.width * scaleX) {
                scaleX = scaleX * (this.canvas.getWidth() / (this.workarea.width * scaleX));
            }
        } else {
            scaleY = scaleX;
            if (this.canvas.getHeight() < this.workarea.height * scaleX) {
                scaleX = scaleX * (this.canvas.getHeight() / (this.workarea.height * scaleX));
            }
        }
        const center = this.canvas.getCenter();
        const point = {
            x: center.left,
            y: center.top,
        };
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.zoomToPoint(point, scaleX);
    }

    zoomIn() {
        let zoomRatio = this.canvas.getZoom();
        zoomRatio += 0.05;
        const center = this.canvas.getCenter();
        const point = {
            x: center.left,
            y: center.top,
        };
        this.zoomToPoint(point, zoomRatio);
    }

    zoomOut() {
        let zoomRatio = this.canvas.getZoom();
        zoomRatio -= 0.05;
        const center = this.canvas.getCenter();
        const point = {
            x: center.left,
            y: center.top,
        };
        this.zoomToPoint(point, zoomRatio);
    }
}

export default ZoomTools;
