import { fabric } from 'fabric';

import Tools, { ITools } from './Tools';
import { IStaticObject } from '../Canvas';

interface ICallbackRet {
    selectable: boolean;
    evented: boolean;
}

type CallbackRetType = ICallbackRet | boolean;

export interface IModeTools extends ITools {
    selection(callback?: (obj: IStaticObject) => CallbackRetType): void;
    grab(callback?: (obj: IStaticObject) => CallbackRetType): void;
    drawing(callback?: (obj: IStaticObject) => CallbackRetType): void;
    moving(e: MouseEvent): void;
}

class ModeTools extends Tools implements IModeTools {
    selection(callback: (obj: IStaticObject) => CallbackRetType) {
        this.canvas.interactionMode = 'selection';
        this.canvas.selection = this.canvasOption.selection;
        this.canvas.defaultCursor = 'default';
        this.workarea.hoverCursor = 'default';
        this.canvas.getObjects().forEach((obj: IStaticObject) => {
            if (obj.id !== 'workarea') {
                if (obj.id === 'grid') {
                    obj.selectable = false;
                    obj.evented = false;
                    return;
                }
                if (callback) {
                    const ret = callback(obj);
                    if (typeof ret === 'object') {
                        obj.selectable = ret.selectable;
                        obj.evented = ret.evented;
                    } else {
                        obj.selectable = ret;
                        obj.evented = ret;
                    }
                } else {
                    obj.selectable = true;
                    obj.evented = true;
                }
            }
        });
        this.canvas.renderAll();
    }

    grab(callback: (obj: IStaticObject) => CallbackRetType) {
        this.canvas.interactionMode = 'grab';
        this.canvas.selection = false;
        this.canvas.defaultCursor = 'grab';
        this.workarea.hoverCursor = 'grab';
        this.canvas.getObjects().forEach((obj: IStaticObject) => {
            if (obj.id !== 'workarea') {
                if (callback) {
                    const ret = callback(obj);
                    if (typeof ret === 'object') {
                        obj.selectable = ret.selectable;
                        obj.evented = ret.evented;
                    } else {
                        obj.selectable = ret;
                        obj.evented = ret;
                    }
                } else {
                    obj.selectable = false;
                    obj.evented = this.canvas.editable ? false : true;
                }
            }
        });
        this.canvas.renderAll();
    }

    drawing(callback: (obj: IStaticObject) => CallbackRetType) {
        this.canvas.interactionMode = 'polygon';
        this.canvas.selection = false;
        this.canvas.defaultCursor = 'pointer';
        this.workarea.hoverCursor = 'pointer';
        this.canvas.getObjects().forEach((obj: IStaticObject) => {
            if (obj.id !== 'workarea') {
                if (callback) {
                    const ret = callback(obj);
                    if (typeof ret === 'object') {
                        obj.selectable = ret.selectable;
                        obj.evented = ret.evented;
                    } else {
                        obj.selectable = ret;
                        obj.evented = ret;
                    }
                } else {
                    obj.selectable = false;
                    obj.evented = this.canvas.editable ? false : true;
                }
            }
        });
        this.canvas.renderAll();
    }

    moving(e: MouseEvent) {
        const delta = new fabric.Point(e.movementX, e.movementY);
        this.canvas.relativePan(delta);
    }
}

export default ModeTools;
