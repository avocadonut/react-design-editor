import { fabric } from 'fabric';

import Tools, { ITools } from './Tools';
import { LayoutType } from '../Canvas';

export interface IWorkareaTools extends ITools {
    setLayout(layout?: LayoutType): void;
    setResponsiveImage(src: any, loaded?: boolean): void;
    setImage(src: any, loaded?: boolean): void;
}

class WorkareaTools extends Tools implements IWorkareaTools {
    setLayout = (layout: LayoutType) => {
        this.workarea.set('layout', layout);
        const { canvas } = this;
        const { _element } = this.workarea;
        let scaleX = 1;
        let scaleY = 1;
        const isFixed = layout === 'fixed';
        const isResponsive = layout === 'responsive';
        const isFullscreen = layout === 'fullscreen';
        if (_element) {
            if (isFixed) {
                scaleX = this.workarea.workareaWidth / _element.width;
                scaleY = this.workarea.workareaHeight / _element.height;
            } else if (isResponsive) {
                scaleX = canvas.getWidth() / _element.width;
                scaleY = canvas.getHeight() / _element.height;
                if (_element.height > _element.width) {
                    scaleX = scaleY;
                } else {
                    scaleY = scaleX;
                }
            } else {
                scaleX = canvas.getWidth() / _element.width;
                scaleY = canvas.getHeight() / _element.height;
            }
        }
        canvas.getObjects().forEach((obj) => {
            if (obj.id !== 'workarea') {
                const objScaleX = !isFullscreen ? 1 : scaleX;
                const objScaleY = !isFullscreen ? 1 : scaleY;
                const objWidth = obj.width * objScaleX * canvas.getZoom();
                const objHeight = obj.height * objScaleY * canvas.getZoom();
                const el = this.canvas.elementTools.findById(obj.id);
                this.canvas.elementTools.setSize(el, objWidth, objHeight);
                if (obj.player) {
                    obj.player.setPlayerSize(objWidth, objHeight);
                }
                obj.set({
                    scaleX: !isFullscreen ? 1 : objScaleX,
                    scaleY: !isFullscreen ? 1 : objScaleY,
                });
            }
        });
        if (isResponsive) {
            if (_element) {
                const center = canvas.getCenter();
                const point = {
                    x: center.left,
                    y: center.top,
                };
                this.workarea.set({
                    scaleX: 1,
                    scaleY: 1,
                });
                canvas.zoomTools.zoomToPoint(point, scaleX);
            } else {
                this.workarea.set({
                    width: 0,
                    height: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                });
            }
            canvas.centerObject(this.workarea);
            canvas.renderAll();
            return;
        }
        if (_element) {
            this.workarea.set({
                width: _element.width,
                height: _element.height,
                scaleX,
                scaleY,
            });
        } else {
            const width = isFixed ? this.workarea.workareaWidth : canvas.getWidth();
            const height = isFixed ? this.workarea.workareaHeight : canvas.getHeight();
            this.workarea.set({
                width,
                height,
            });
            if (isFixed) {
                canvas.centerObject(this.workarea);
            } else {
                this.workarea.set({
                    left: 0,
                    top: 0,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                });
            }
        }
        canvas.centerObject(this.workarea);
        const center = canvas.getCenter();
        const point = {
            x: center.left,
            y: center.top,
        };
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.zoomTools.zoomToPoint(point, 1);
        canvas.renderAll();
    }

    setResponsiveImage = (src: any, loaded?: boolean) => {
        const { canvas, workarea } = this;
        const { editable } = this;
        const imageFromUrl = (source) => {
            fabric.Image.fromURL(source, (img) => {
                let scaleX = canvas.getWidth() / img.width;
                let scaleY = canvas.getHeight() / img.height;
                if (img.height > img.width) {
                    scaleX = scaleY;
                    if (canvas.getWidth() < img.width * scaleX) {
                        scaleX = scaleX * (canvas.getWidth() / (img.width * scaleX));
                    }
                } else {
                    scaleY = scaleX;
                    if (canvas.getHeight() < img.height * scaleX) {
                        scaleX = scaleX * (canvas.getHeight() / (img.height * scaleX));
                    }
                }
                img.set({
                    originX: 'left',
                    originY: 'top',
                });
                workarea.set({
                    ...img,
                    selectable: false,
                });
                if (!source) {
                    scaleX = 1;
                }
                canvas.centerObject(workarea);
                if (editable && !loaded) {
                    canvas.getObjects().forEach((obj, index) => {
                        if (index !== 0) {
                            const objWidth = obj.width * scaleX;
                            const objHeight = obj.height * scaleY;
                            const el = canvas.elementTools.findById(obj.id);
                            canvas.elementTools.setSize(el, objWidth, objHeight);
                            if (obj.player) {
                                obj.player.setPlayerSize(objWidth, objHeight);
                            }
                            obj.set({
                                scaleX: 1,
                                scaleY: 1,
                            });
                            obj.setCoords();
                        }
                    });
                }
                const center = canvas.getCenter();
                const point = {
                    x: center.left,
                    y: center.top,
                };
                canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                canvas.zoomTools.zoomToPoint(point, scaleX);
                canvas.renderAll();
            });
        };
        if (!src) {
            workarea.set({
                src,
            });
            imageFromUrl(src);
            return;
        }
        if (typeof src === 'string') {
            workarea.set({
                src,
            });
            imageFromUrl(src);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            workarea.set({
                file: src,
            });
            imageFromUrl(e.target.result);
        };
        reader.readAsDataURL(src);
    }

    setImage = (src: any, loaded = false) => {
        const { canvas, workarea } = this;
        const { editable } = this;
        if (workarea.layout === 'responsive') {
            this.setResponsiveImage(src, loaded);
            return;
        }
        const imageFromUrl = (source) => {
            fabric.Image.fromURL(source, (img) => {
                let width = canvas.getWidth();
                let height = canvas.getHeight();
                if (workarea.layout === 'fixed') {
                    width = workarea.width * workarea.scaleX;
                    height = workarea.height * workarea.scaleY;
                }
                let scaleX = 1;
                let scaleY = 1;
                if (source) {
                    scaleX = width / img.width;
                    scaleY = height / img.height;
                    img.set({
                        originX: 'left',
                        originY: 'top',
                        scaleX,
                        scaleY,
                    });
                    workarea.set({
                        ...img,
                        selectable: false,
                    });
                } else {
                    workarea.set({
                        _element: null,
                        selectable: false,
                    });
                }
                canvas.centerObject(workarea);
                if (editable && !loaded) {
                    const { layout } = workarea;
                    canvas.getObjects().forEach((obj, index) => {
                        if (index !== 0) {
                            scaleX = layout !== 'fullscreen' ? 1 : scaleX;
                            scaleY = layout !== 'fullscreen' ? 1 : scaleY;
                            const objWidth = obj.width * scaleX;
                            const objHeight = obj.height * scaleY;
                            const el = this.canvas.elementTools.findById(obj.id);
                            this.canvas.elementTools.setSize(el, width, height);
                            if (obj.player) {
                                obj.player.setPlayerSize(objWidth, objHeight);
                            }
                            obj.set({
                                scaleX,
                                scaleY,
                            });
                            obj.setCoords();
                        }
                    });
                }
                const center = canvas.getCenter();
                const point = {
                    x: center.left,
                    y: center.top,
                };
                canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                canvas.zoomTools.zoomToPoint(point, 1);
                canvas.renderAll();
            });
        };
        if (!src) {
            workarea.set({
                src,
            });
            imageFromUrl(src);
            return;
        }
        if (typeof src === 'string') {
            workarea.set({
                src,
            });
            imageFromUrl(src);
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            workarea.set({
                file: src,
            });
            imageFromUrl(e.target.result);
        };
        reader.readAsDataURL(src);
    }
}

export default WorkareaTools;
