import { fabric } from 'fabric';
import uuid from 'uuid/v4';

import Tools, { ITools } from './Tools';
import { IStaticObject, IStaticCanvas, IKeyboardEvent } from '../Canvas';

export interface IObjectEvent {
    mousedown?(opt: fabric.IEvent): void;
}

export interface IEventTools extends ITools {
    prevTarget?: IStaticObject;
    currentWidth?: number;
    keyEvent?: IKeyboardEvent;
    object?: IObjectEvent;
    modified?(opt: fabric.IEvent): void;
    moving?(opt: fabric.IEvent): void;
    moved?(opt: fabric.IEvent): void;
    scaling?(opt: fabric.IEvent): void;
    rotating?(opt: fabric.IEvent): void;
    arrowmoving?(e: KeyboardEvent): void;
    mousewheel?(opt: fabric.IEvent): void;
    mousedown?(opt: fabric.IEvent): void;
    mousemove?(opt: fabric.IEvent): void;
    mouseup?(opt: fabric.IEvent): void;
    mouseout?(opt: fabric.IEvent): void;
    selection?(opt: fabric.IEvent): void;
    beforeRender?(opt: fabric.IEvent): void;
    afterRender?(opt: fabric.IEvent): void;
    resize?(currentWidth: number, currentHeight: number, nextWidth: number, nextHeight: number): void;
    paste?(e: ClipboardEvent): void;
    keydown?(e: KeyboardEvent): void;
    contextmenu?(e: MouseEvent): void;
    onmousedown?(e: MouseEvent): void;
}

class EventTools extends Tools implements IEventTools {
    currentWidth: number;
    prevTarget?: IStaticObject;
    keyEvent: IKeyboardEvent;

    constructor(toolOption: ITools, keyEvent: IKeyboardEvent) {
        super(toolOption);
        this.keyEvent = keyEvent;
    }

    object: IObjectEvent = {
        mousedown: (opt: fabric.IEvent) => {
            const target = opt.target as IStaticObject;
            if (target && target.link && target.link.enabled) {
                const { onLink } = this;
                if (onLink) {
                    onLink(this.canvas, target);
                }
            }
        },
    };

    modified = (opt: fabric.IEvent) => {
        const target = opt.target as IStaticObject;
        const { onModified } = this;
        if (onModified) {
            if (!target) {
                return;
            }
            if (target.type === 'circle' && target.parentId) {
                return;
            }
            onModified(target);
        }
    }

    moving = (opt: fabric.IEvent) => {
        const target = opt.target as IStaticObject;
        if (this.canvas.interactionMode === 'crop') {
            this.canvas.cropTools.moving(opt);
        } else {
            if (this.editable && this.guidelineOption.enabled) {
                this.canvas.guidelineTools.movingGuidelines(target);
            }
            if (target.superType === 'node') {
                this.canvas.portTools.setCoords(target);
                if (target.iconButton) {
                    target.iconButton.set({
                        left: target.left + 5,
                        top: target.top + 5,
                    });
                }
            } else if (this.canvas.generalTools.isElementType(target.type)) {
                const el = this.canvas.elementTools.findById(target.id);
                // update the element
                this.canvas.elementTools.setPosition(el, target.left, target.top);
            }
        }
    }

    moved = (opt: fabric.IEvent) => {
        const { target } = opt;
        this.canvas.gridTools.setCoords(target);
    }

    scaling = (opt: fabric.IEvent) => {
        const target = opt.target as IStaticObject;
        if (this.canvas.interactionMode === 'crop') {
            this.canvas.cropTools.resize(opt);
        }
        // TODO...this.guidelineHandlers.scalingGuidelines(target);
        if (this.canvas.generalTools.isElementType(target.type)) {
            const zoom = this.canvas.getZoom();
            const width = target.width * target.scaleX * zoom;
            const height = target.height * target.scaleY * zoom;
            const el = this.canvas.elementTools.findById(target.id);
            // update the element
            this.canvas.elementTools.setSize(el, width, height);
            this.canvas.elementTools.setPosition(el, target.left, target.top);
            if (target.type === 'video' && target.player) {
                target.player.setPlayerSize(width, height);
            }
        }
    }

    rotating = (opt: fabric.IEvent) => {
        const target = opt.target as IStaticObject;
        if (this.canvas.generalTools.isElementType(target.type)) {
            const el = this.canvas.elementTools.findById(target.id);
            // update the element
            el.style.transform = `rotate(${target.angle}deg)`;
        }
    }

    arrowmoving = (e: KeyboardEvent): void => {
        const activeObject = this.canvas.getActiveObject() as IStaticObject;
        if (!activeObject) {
            return null;
        }
        if (activeObject.id === 'workarea') {
            return null;
        }
        if (e.keyCode === 38) {
            activeObject.set('top', activeObject.top - 2);
            activeObject.setCoords();
            this.canvas.renderAll();
        } else if (e.keyCode === 40) {
            activeObject.set('top', activeObject.top + 2);
            activeObject.setCoords();
            this.canvas.renderAll();
        } else if (e.keyCode === 37) {
            activeObject.set('left', activeObject.left - 2);
            activeObject.setCoords();
            this.canvas.renderAll();
        } else if (e.keyCode === 39) {
            activeObject.set('left', activeObject.left + 2);
            activeObject.setCoords();
            this.canvas.renderAll();
        }
        if (this.onModified) {
            this.onModified(activeObject);
        }
    }

    mousewheel = (opt: fabric.IEvent) => {
        const { zoomEnabled } = this;
        if (!zoomEnabled) {
            return;
        }
        const e = opt.e as WheelEvent;
        const delta = e.deltaY;
        let zoomRatio = this.canvas.getZoom();
        if (delta > 0) {
            zoomRatio -= 0.05;
        } else {
            zoomRatio += 0.05;
        }
        this.canvas.zoomTools.zoomToPoint(new fabric.Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2), zoomRatio);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }

    mousedown = (opt: fabric.IEvent) => {
        if (this.canvas.interactionMode === 'grab') {
            this.canvas.panning = true;
            return;
        }
        const { editable } = this;
        const target = opt.target as IStaticObject;
        if (editable) {
            if (this.prevTarget && this.prevTarget.superType === 'link') {
                this.prevTarget.set({
                    stroke: this.prevTarget.originStroke,
                });
            }
            if (target && target.type === 'fromPort') {
                if (this.canvas.interactionMode === 'link' && this.canvas.linkTools.activeLine) {
                    console.warn('이미 링크를 그리는 중입니다.');
                    return;
                }
                this.canvas.linkTools.init(target);
                return;
            }
            if (target && this.canvas.interactionMode === 'link' && (target.type === 'toPort' || target.superType === 'node')) {
                let toPort;
                if (target.superType === 'node') {
                    toPort = target.toPort;
                } else {
                    toPort = target;
                }
                if (toPort.links.some(link => link.fromNode.id === this.canvas.linkTools.activeLine.fromNode)) {
                    console.warn('중복된 연결을 할 수 없습니다.');
                    return;
                }
                this.canvas.linkTools.generate(toPort);
                return;
            }
            this.canvas.guidelineTools.viewportTransform = this.canvas.viewportTransform;
            this.canvas.guidelineTools.zoom = this.canvas.getZoom();
            if (this.canvas.interactionMode === 'selection') {
                if (target && target.superType === 'link') {
                    target.set({
                        stroke: target.selectedStroke || 'green',
                    });
                }
                this.prevTarget = target;
            }
            if (this.canvas.interactionMode === 'polygon') {
                if (target && this.canvas.drawingTools.pointArray.length && target.id === this.canvas.drawingTools.pointArray[0].id) {
                    this.canvas.drawingTools.polygon.generatePolygon(this.canvas.drawingTools.pointArray);
                } else {
                    this.canvas.drawingTools.polygon.addPoint(opt);
                }
            }
        }
    }

    mousemove = (opt: fabric.IEvent): void => {
        if (this.canvas.interactionMode === 'grab' && this.canvas.panning) {
            this.canvas.modeTools.moving(opt.e as MouseEvent);
            this.canvas.requestRenderAll();
            return null;
        }
        const target = opt.target as IStaticObject;
        if (!opt.target) {
            this.canvas.tooltipTools.hide(target);
        }
        if (!this.editable && opt.target) {
            if (this.canvas.generalTools.isElementType(target.type)) {
                return null;
            }
            if (target.id !== 'workarea') {
                if (opt.target !== this.canvas.tooltipTools.target) {
                    this.canvas.tooltipTools.show(target);
                }
            } else {
                this.canvas.tooltipTools.hide(target);
            }
        }
        if (this.canvas.interactionMode === 'polygon') {
            if (this.canvas.drawingTools.activeLine && this.canvas.drawingTools.activeLine.class === 'line') {
                const pointer = this.canvas.getPointer(opt.e);
                this.canvas.drawingTools.activeLine.set({ x2: pointer.x, y2: pointer.y });
                const points = this.canvas.drawingTools.activeShape.get('points');
                points[this.canvas.drawingTools.pointArray.length] = {
                    x: pointer.x,
                    y: pointer.y,
                };
                this.canvas.drawingTools.activeShape.set({
                    points,
                });
                this.canvas.requestRenderAll();
            }
        } else if (this.canvas.interactionMode === 'link') {
            if (this.canvas.linkTools.activeLine && this.canvas.linkTools.activeLine.class === 'line') {
                const pointer = this.canvas.getPointer(opt.e);
                this.canvas.linkTools.activeLine.set({ x2: pointer.x, y2: pointer.y });
            }
            this.canvas.requestRenderAll();
        }
    }

    mouseup = (opt: fabric.IEvent): void => {
        if (this.canvas.interactionMode === 'grab') {
            this.canvas.panning = false;
            return null;
        }
        if (this.editable && this.guidelineOption.enabled) {
            this.canvas.guidelineTools.verticalLines.length = 0;
            this.canvas.guidelineTools.horizontalLines.length = 0;
        }
        this.canvas.renderAll();
    }

    mouseout = (opt: fabric.IEvent) => {
        if (!opt.target) {
            this.canvas.tooltipTools.hide();
        }
    }

    selection = (opt: fabric.IEvent) => {
        const { onSelect, activeSelection } = this;
        const { target } = opt;
        if (target && target.type === 'activeSelection') {
            target.set({
                ...activeSelection,
            });
        }
        if (onSelect) {
            onSelect(target);
        }
    }

    beforeRender = (opt: fabric.IEvent) => {
        if (this.canvas) {
            this.canvas.clearContext(this.canvas.contextTop);
        }
    }

    afterRender = (opt: fabric.IEvent) => {
        for (let i = this.canvas.guidelineTools.verticalLines.length; i--;) {
            this.canvas.guidelineTools.drawVerticalLine(this.canvas.guidelineTools.verticalLines[i]);
        }
        for (let i = this.canvas.guidelineTools.horizontalLines.length; i--;) {
            this.canvas.guidelineTools.drawHorizontalLine(this.canvas.guidelineTools.horizontalLines[i]);
        }
        this.canvas.guidelineTools.verticalLines.length = 0;
        this.canvas.guidelineTools.horizontalLines.length = 0;
    }

    resize = (currentWidth: number, currentHeight: number, nextWidth: number, nextHeight: number) => {
        this.currentWidth = currentWidth;
        this.canvas.setWidth(nextWidth).setHeight(nextHeight);
        if (!this.workarea) {
            return;
        }
        const diffWidth = (nextWidth / 2) - (currentWidth / 2);
        const diffHeight = (nextHeight / 2) - (currentHeight / 2);
        if (this.workarea.layout === 'fixed') {
            this.canvas.centerObject(this.workarea);
            this.workarea.setCoords();
            this.canvas.getObjects().forEach((obj: IStaticObject, index) => {
                if (index !== 0) {
                    const left = obj.left + diffWidth;
                    const top = obj.top + diffHeight;
                    const el = this.canvas.elementTools.findById(obj.id);
                    this.canvas.elementTools.setPosition(el, left, top);
                    obj.set({
                        left,
                        top,
                    });
                    obj.setCoords();
                }
            });
            this.canvas.renderAll();
            return;
        }
        let scaleX = nextWidth / this.workarea.width;
        const scaleY = nextHeight / this.workarea.height;
        if (this.workarea.layout === 'responsive') {
            if (this.workarea.height > this.workarea.width) {
                scaleX = scaleY;
                if (nextWidth < this.workarea.width * scaleX) {
                    scaleX = scaleX * (nextWidth / (this.workarea.width * scaleX));
                }
            } else {
                if (nextHeight < this.workarea.height * scaleX) {
                    scaleX = scaleX * (nextHeight / (this.workarea.height * scaleX));
                }
            }
            const deltaPoint = new fabric.Point(diffWidth, diffHeight);
            this.canvas.relativePan(deltaPoint);
            const center = this.canvas.getCenter();
            const point = {
                x: center.left,
                y: center.top,
            };
            this.canvas.zoomTools.zoomToPoint(point, scaleX);
            this.canvas.getObjects().forEach((obj: IStaticObject) => {
                if (this.canvas.generalTools.isElementType(obj.type)) {
                    const width = obj.width * obj.scaleX * scaleX;
                    const height = obj.height * obj.scaleY * scaleX;
                    const { left, top } = obj.getBoundingRect();
                    const el = this.canvas.elementTools.findById(obj.id);
                    this.canvas.elementTools.setSize(el, width, height);
                    this.canvas.elementTools.setPosition(el, left, top);
                    if (obj.player) {
                        obj.player.setPlayerSize(width, height);
                    }
                }
            });
            this.canvas.renderAll();
            return;
        }
        const diffScaleX = nextWidth / (this.workarea.width * this.workarea.scaleX);
        const diffScaleY = nextHeight / (this.workarea.height * this.workarea.scaleY);
        this.workarea.set({
            scaleX,
            scaleY,
        });
        this.canvas.getObjects().forEach((obj: IStaticObject) => {
            if (obj.id !== 'workarea') {
                const left = obj.left * diffScaleX;
                const top = obj.top * diffScaleY;
                const width = obj.width * scaleX;
                const height = obj.height * scaleY;
                const el = this.canvas.elementTools.findById(obj.id);
                this.canvas.elementTools.setSize(el, width, height);
                if (obj.player) {
                    obj.player.setPlayerSize(width, height);
                }
                this.canvas.elementTools.setPosition(el, left, top);
                const newScaleX = obj.scaleX * diffScaleX;
                const newScaleY = obj.scaleY * diffScaleY;
                obj.set({
                    scaleX: newScaleX,
                    scaleY: newScaleY,
                    left,
                    top,
                });
                obj.setCoords();
            }
        });
        this.canvas.renderAll();
    }

    paste = (e: ClipboardEvent): void => {
        if (this.canvas.wrapperEl !== document.activeElement) {
            return null;
        }
        e = e || window.event as ClipboardEvent;
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        const clipboardData = e.clipboardData;
        if (clipboardData.types.length) {
            clipboardData.types.forEach((clipboardType) => {
                if (clipboardType === 'text/plain') {
                    const textPlain = clipboardData.getData('text/plain');
                    const item = {
                        id: uuid(),
                        type: 'textbox',
                        text: textPlain,
                    };
                    this.canvas.generalTools.add(item, true);
                } else if (clipboardType === 'text/html') {
                    // Todo ...
                    // const textHtml = clipboardData.getData('text/html');
                    // console.log(textHtml);
                } else if (clipboardType === 'Files') {
                    Array.from(clipboardData.files).forEach((file: any) => {
                        const { type } = file;
                        if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
                            const item = {
                                id: uuid(),
                                type: 'image',
                                file,
                            };
                            this.canvas.generalTools.add(item, true);
                        } else {
                            console.error('Not supported file type');
                        }
                    });
                }
            });
        }
    }

    keydown = (e: KeyboardEvent): void => {
        if (this.canvas.wrapperEl !== document.activeElement) {
            return null;
        }
        const { keyEvent } = this;
        if (!Object.keys(keyEvent).length) {
            return null;
        }
        const { move, all, copy, paste, esc, del } = keyEvent;
        if (e.keyCode === 46 && del) {
            this.canvas.generalTools.remove();
        } else if (e.code.includes('Arrow') && move) {
            this.arrowmoving(e);
        } else if (e.ctrlKey && e.keyCode === 65 && all) {
            e.preventDefault();
            this.canvas.generalTools.allSelect();
        } else if (e.ctrlKey && e.keyCode === 67 && copy) {
            e.preventDefault();
            this.canvas.generalTools.copy();
        } else if (e.ctrlKey && e.keyCode === 86 && paste) {
            e.preventDefault();
            this.canvas.generalTools.paste();
        } else if (e.keyCode === 27 && esc) {
            if (this.canvas.interactionMode === 'selection') {
                this.canvas.discardActiveObject();
            } else if (this.canvas.interactionMode === 'polygon') {
                this.canvas.drawingTools.polygon.finishDraw();
            } else if (this.canvas.interactionMode === 'link') {
                this.canvas.linkTools.finish();
            }
        }
    }

    contextmenu = (e: MouseEvent) => {
        e.preventDefault();
        const { editable, onContext } = this;
        if (editable && onContext) {
            const target = this.canvas.findTarget(e, false) as IStaticObject & IStaticCanvas;
            if (target && target.type !== 'activeSelection') {
                this.canvas.generalTools.select(target);
            }
            this.canvas.contextmenuTools.show(e, target);
        }
    }

    onmousedown = (e: MouseEvent) => {
        this.canvas.contextmenuTools.hide();
    }
}

export default EventTools;
