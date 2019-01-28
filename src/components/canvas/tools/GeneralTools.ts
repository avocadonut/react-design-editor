import { fabric } from 'fabric';
import uuid from 'uuid/v4';

import Tools, { ITools } from './Tools';
import {
    IStaticObject,
    IStaticWorkarea,
    IStaticImage,
    defaultWorkareaOption,
} from '../Canvas';

export interface IGeneralTools extends ITools {
    clipboard?: IStaticObject;
    centerObject(obj: IStaticObject, centered?: boolean): void;
    add(obj: any, centered?: boolean, loaded?: boolean): IStaticObject | null;
    addGroup(obj: any, centered?: boolean, loaded?: boolean): void;
    addImage(obj: any, centered?: boolean, loaded?: boolean): void;
    addElement(obj: any, centered?: boolean, loaded?: boolean): void;
    remove(): void;
    removeById(id: string): void;
    removeOriginById(id: string): void;
    duplicate(): void;
    duplicateById(id: string): void;
    copy(): void;
    paste(): void;
    set<K extends keyof IStaticObject>(key: K, value: IStaticObject[K]): void;
    setObject(options: Partial<IStaticObject>): void;
    setByObject<K extends keyof IStaticObject>(obj: IStaticObject, key: K, value: IStaticObject[K]): void;
    setById<K extends keyof IStaticObject>(id: string, key: K, value: IStaticObject[K]): void;
    setShadow(option: fabric.IShadowOptions): void;
    setImage(obj: IStaticImage, src: any): void;
    setImageById(id: string, src: any): void;
    loadImage(obj: IStaticImage, src: any): void;
    find(obj: any): IStaticObject | null;
    findById(id: string): IStaticObject | null;
    findOriginById(id: string): IStaticObject | null;
    findOriginByIdWithIndex(id: string): { object: IStaticObject, index: number };
    allSelect(): void;
    select(obj: any): void;
    selectById(id: string): void;
    originScaleToResize(obj: any, width: number, height: number): void;
    scaleToResize(width: number, height: number): void;
    importJSON(json: any, callback: any): void;
    exportJSON(): string;
    getObjects(): IStaticObject[];
    getOriginObjects(): IStaticObject[];
    bringForward(): void;
    bringToFront(): void;
    sendBackwards(): void;
    sendToBack(): void;
    clear(isWorkarea?: boolean): void;
    toGroup(): void;
    toActiveSelection(): void;
    isElementType(type: string): boolean;
}

class GeneralTools extends Tools implements IGeneralTools {
    clipboard?: IStaticObject;

    centerObject(obj: IStaticObject, centered?: boolean) {
        if (centered) {
            this.canvas.centerObject(obj);
            obj.setCoords();
        } else {
            const left = (obj.left / this.canvas.getZoom())
                - (obj.width / 2) - (this.canvas.viewportTransform[4] / this.canvas.getZoom());
            this.setByObject(obj, 'left', left);
            const top = (obj.top / this.canvas.getZoom())
                - (obj.height / 2) - (this.canvas.viewportTransform[5] / this.canvas.getZoom());
            this.setByObject(obj, 'top', top);
        }
    }

    add(obj: any, centered?: boolean, loaded?: boolean): IStaticObject | null {
        const { editable } = this.canvas;
        const option = {
            hasControls: editable,
            hasBorders: editable,
            selection: editable,
            lockMovementX: !editable,
            lockMovementY: !editable,
            hoverCursor: !editable ? 'pointer' : 'move',
            editable: false,
            scaleX: 1,
            scaleY: 1,
        };
        if (obj.type === 'i-text') {
            option.editable = false;
        } else {
            option.editable = editable;
        }
        if (editable && this.workarea.layout === 'fullscreen') {
            option.scaleX = this.workarea.scaleX;
            option.scaleY = this.workarea.scaleY;
        }
        const newOption = Object.assign({}, option, obj);
        let createdObj;
        if (obj.type === 'group') {
            const objects = this.addGroup(newOption, centered, loaded);
            const groupOption = Object.assign({}, newOption, { objects });
            if (obj.type === 'image') {
                this.addImage(newOption, centered, loaded);
                return null;
            }
            if (this.isElementType(obj.type)) {
                this.addElement(newOption, centered);
                return null;
            }
            createdObj = this.fabricObjects[obj.type].create({ ...groupOption });
            if (!editable && !this.isElementType(obj.type)) {
                createdObj.on('mousedown', this.canvas.eventTools.object.mousedown);
            }
            this.canvas.add(createdObj);
            this.objects.push(createdObj);
            if (obj.type !== 'polygon' && editable && !loaded) {
                this.centerObject(createdObj, centered);
            }
            if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                this.canvas.animationTools.play(createdObj.id);
            }
            const { onAdd } = this;
            if (onAdd && editable && !loaded) {
                onAdd(createdObj);
            }
            return createdObj;
        }
        if (obj.type === 'image') {
            this.addImage(newOption, centered, loaded);
            return null;
        }
        if (this.isElementType(obj.type)) {
            this.addElement(newOption, centered);
            return null;
        }
        if (obj.superType === 'link') {
            return this.canvas.linkTools.create({ ...newOption });
        }
        createdObj = this.fabricObjects[obj.type].create({ ...newOption });
        if (!editable && !this.isElementType(obj.type)) {
            createdObj.on('mousedown', this.canvas.eventTools.object.mousedown);
        }
        this.canvas.add(createdObj);
        this.objects.push(createdObj);
        if (obj.type !== 'polygon' && obj.superType !== 'link' && editable && !loaded) {
            this.centerObject(createdObj, centered);
        }
        if (createdObj.superType === 'node') {
            this.canvas.portTools.createPort(createdObj);
            if (createdObj.iconButton) {
                this.canvas.add(createdObj.iconButton);
            }
        }
        if (!editable && createdObj.animation && createdObj.animation.autoplay) {
            this.canvas.animationTools.play(createdObj.id);
        }
        const { onAdd } = this;
        if (onAdd && editable && !loaded) {
            onAdd(createdObj);
        }
        if (!loaded) {
            if (createdObj.superType === 'node') {
                createdObj.setShadow({
                    color: createdObj.stroke,
                });
                this.canvas.nodeTools.highlightingNode(createdObj);
            }
        }
        return createdObj;
    }

    addGroup(obj: any, centered?: boolean, loaded?: boolean): any {
        return obj.objects.map((child: any) => {
            return this.add(child, centered, loaded);
        });
    }

    addImage(obj: any, centered?: boolean, loaded?: boolean): void {
        const { editable } = this;
        const image = new Image();
        const { src, file, ...otherOption } = obj;
        const createImage = (img: HTMLImageElement) => {
            const createdObj = new fabric.Image(img, {
                src,
                file,
                ...this.defaultOptions,
                ...otherOption,
            }) as IStaticObject;
            if (!editable) {
                createdObj.on('mousedown', this.canvas.eventTools.object.mousedown);
            }
            this.canvas.add(createdObj);
            this.objects.push(createdObj);
            if (editable && !loaded) {
                this.centerObject(createdObj, centered);
            }
            if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                this.canvas.animationTools.play(createdObj.id);
            }
            const { onAdd } = this;
            if (onAdd && editable && !loaded) {
                onAdd(createdObj);
            }
        };
        if (src) {
            image.onload = () => {
                createImage(image);
            };
            image.src = src;
            return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            image.onload = () => {
                createImage(image);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    addElement(obj: any, centered?: boolean, loaded?: boolean): void {
        const { editable } = this.canvas;
        const { src, file, code, ...otherOption } = obj;
        const createdObj = new fabric.Rect({
            src,
            file,
            code,
            ...this.defaultOptions,
            ...otherOption,
            fill: 'rgba(255, 255, 255, 0)',
            stroke: 'rgba(255, 255, 255, 0)',
        }) as IStaticObject;
        if (!editable) {
            createdObj.on('mousedown', this.canvas.eventTools.object.mousedown);
        }
        this.canvas.add(createdObj);
        this.objects.push(createdObj);
        if (src || file || code) {
            if (obj.type === 'video') {
                this.canvas.videoTools.set(createdObj, src || file);
            } else {
                this.canvas.elementTools.set(createdObj, src || code);
            }
        }
        if (editable && !loaded) {
            this.centerObject(createdObj, centered);
        }
        const { onAdd } = this;
        if (onAdd && editable && !loaded) {
            onAdd(createdObj);
        }
    }

    remove(): void {
        const activeObject = this.canvas.getActiveObject() as IStaticObject;
        if (!activeObject) {
            return null;
        }
        if (activeObject.type !== 'activeSelection') {
            this.canvas.discardActiveObject();
            if (this.isElementType(activeObject.type)) {
                this.canvas.elementTools.removeById(activeObject.id);
                this.canvas.elementTools.removeStyleById(activeObject.id);
                this.canvas.elementTools.removeScriptById(activeObject.id);
            }
            if (activeObject.superType === 'link') {
                this.canvas.linkTools.remove(activeObject);
            } else if (activeObject.superType === 'node') {
                if (activeObject.toPort) {
                    if (activeObject.toPort.links.length) {
                        activeObject.toPort.links.forEach((link) => {
                            this.canvas.linkTools.remove(link, 'from');
                        });
                    }
                    this.canvas.remove(activeObject.toPort);
                }
                if (activeObject.fromPort && activeObject.fromPort.length) {
                    activeObject.fromPort.forEach((port) => {
                        if (port.links.length) {
                            port.links.forEach((link) => {
                                this.canvas.linkTools.remove(link, 'to');
                            });
                        }
                        this.canvas.remove(port);
                    });
                }
            }
            this.canvas.remove(activeObject);
            this.removeOriginById(activeObject.id);
        } else {
            const { _objects: activeObjects } = activeObject;
            this.canvas.discardActiveObject();
            activeObjects.forEach((obj: IStaticObject) => {
                if (this.isElementType(obj.type)) {
                    this.canvas.elementTools.removeById(obj.id);
                    this.canvas.elementTools.removeStyleById(obj.id);
                    this.canvas.elementTools.removeScriptById(obj.id);
                } else if (obj.superType === 'node') {
                    this.canvas.remove(obj.toPort);
                    obj.fromPort.forEach((port) => {
                        this.canvas.remove(port);
                    });
                }
                this.canvas.remove(obj);
                this.removeOriginById(obj.id);
            });
        }
        const { onRemove } = this;
        if (onRemove) {
            onRemove(activeObject);
        }
    }

    removeById(id: string) {
        const findObject = this.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            const { onRemove } = this;
            if (onRemove) {
                onRemove(findObject);
            }
            if (this.isElementType(findObject.type)) {
                this.canvas.elementTools.removeById(findObject.id);
                this.canvas.elementTools.removeStyleById(findObject.id);
                this.canvas.elementTools.removeScriptById(findObject.id);
            }
            this.canvas.remove(findObject);
            this.removeOriginById(findObject.id);
        }
    }

    removeOriginById(id: string)  {
        const object = this.findOriginByIdWithIndex(id);
        if (object) {
            this.objects.splice(object.index, 1);
        }
    }

    duplicate(): void {
        const { onAdd, propertiesToInclude } = this;
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return null;
        }
        activeObject.clone((clonedObj) => {
            this.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = this.canvas;
                clonedObj.forEachObject((obj) => {
                    obj.set('name', `${obj.name}_clone`);
                    obj.set('id', uuid());
                    this.canvas.add(obj);
                    this.objects.push(obj);
                });
                if (onAdd) {
                    onAdd(clonedObj);
                }
                clonedObj.setCoords();
            } else {
                clonedObj.set('name', `${clonedObj.name}_clone`);
                clonedObj.set('id', uuid());
                this.canvas.add(clonedObj);
                this.objects.push(clonedObj);
                if (onAdd) {
                    onAdd(clonedObj);
                }
            }
            this.canvas.setActiveObject(clonedObj);
            this.canvas.portTools.createPort(clonedObj);
            this.canvas.requestRenderAll();
        }, propertiesToInclude);
    }

    duplicateById(id: string) {
        const { onAdd, propertiesToInclude } = this;
        const findObject = this.findById(id);
        if (findObject) {
            findObject.clone((cloned: IStaticObject) => {
                cloned.set({
                    left: cloned.left + 10,
                    top: cloned.top + 10,
                    id: uuid(),
                    name: `${cloned.name}_clone`,
                    evented: true,
                });
                this.canvas.add(cloned);
                this.objects.push(cloned);
                if (onAdd) {
                    onAdd(cloned);
                }
                this.canvas.setActiveObject(cloned);
                this.canvas.portTools.createPort(cloned);
                this.canvas.requestRenderAll();
            }, propertiesToInclude);
        }
    }

    copy(): void {
        const { propertiesToInclude } = this;
        const activeObject = this.canvas.getActiveObject() as IStaticObject;
        if (activeObject && activeObject.superType === 'link') {
            return null;
        }
        if (activeObject) {
            activeObject.clone((cloned) => {
                this.clipboard = cloned;
            }, propertiesToInclude);
        }
    }

    paste(): void {
        const { onAdd, propertiesToInclude } = this;
        const { clipboard } = this;
        if (!clipboard) {
            return null;
        }
        clipboard.clone((clonedObj: IStaticObject) => {
            this.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                id: uuid(),
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = this.canvas;
                clonedObj.forEachObject((obj) => {
                    obj.set('id', uuid());
                    obj.set('name', `${obj.name}_clone`);
                    this.canvas.add(obj);
                    this.objects.push(obj);
                });
                if (onAdd) {
                    onAdd(clonedObj);
                }
                clonedObj.setCoords();
            } else {
                clonedObj.set('id', uuid());
                clonedObj.set('name', `${clonedObj.name}_clone`);
                this.canvas.add(clonedObj);
                this.objects.push(clonedObj);
                if (onAdd) {
                    onAdd(clonedObj);
                }
            }
            const newClipboard = clipboard.set({
                top: clonedObj.top,
                left: clonedObj.left,
            });
            this.clipboard = newClipboard;
            this.canvas.setActiveObject(clonedObj);
            if (clonedObj.superType === 'node') {
                this.canvas.portTools.createPort(clonedObj);
            }
            this.canvas.requestRenderAll();
        }, propertiesToInclude);
    }

    set<K extends keyof IStaticObject>(key: K, value: IStaticObject[K]): void {
        const activeObject = this.canvas.getActiveObject() as IStaticObject;
        if (!activeObject) {
            return null;
        }
        activeObject.set(key, value);
        activeObject.setCoords();
        this.canvas.requestRenderAll();
        const { onModified } = this;
        if (onModified) {
            onModified(activeObject);
        }
    }

    setObject(options: Partial<IStaticObject>): void {
        const activeObject = this.canvas.getActiveObject() as IStaticObject;
        if (!activeObject) {
            return null;
        }
        activeObject.set(options);
        activeObject.setCoords();
        this.canvas.requestRenderAll();
        const { onModified } = this;
        if (onModified) {
            onModified(activeObject);
        }
    }

    setByObject<K extends keyof IStaticObject>(obj: IStaticObject, key: K, value: IStaticObject[K]) {
        if (!obj) {
            return;
        }
        obj.set(key, value);
        obj.setCoords();
        this.canvas.renderAll();
        const { onModified } = this;
        if (onModified) {
            onModified(obj);
        }
    }

    setById<K extends keyof IStaticObject>(id: string, key: K, value: IStaticObject[K]) {
        const findObject = this.findById(id);
        this.setByObject(findObject, key, value);
    }

    setShadow(option: fabric.IShadowOptions): void {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return null;
        }
        activeObject.setShadow(option);
        this.canvas.requestRenderAll();
        const { onModified } = this;
        if (onModified) {
            onModified(activeObject);
        }
    }

    setImage(obj: IStaticImage, src: any) {
        if (!src) {
            this.loadImage(obj, null);
            obj.set('file', null);
            obj.set('src', null);
            return;
        }
        if (typeof src === 'string') {
            this.loadImage(obj, src);
            obj.set('file', null);
            obj.set('src', src);
        } else {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.loadImage(obj, e.target.result);
                const file = {
                    name: src.name,
                    size: src.size,
                    uid: src.uid,
                    type: src.type,
                };
                obj.set('file', file);
                obj.set('src', null);
            };
            reader.readAsDataURL(src);
        }
    }

    setImageById(id: string, src: any) {
        const findObject = this.findById(id) as IStaticImage;
        this.setImage(findObject, src);
    }

    loadImage(obj: IStaticImage, src: any) {
        fabric.util.loadImage(src, (source) => {
            if (obj.type !== 'image') {
                obj.setPatternFill({
                    source,
                    repeat: 'repeat',
                });
                obj.setCoords();
                this.canvas.renderAll();
                return;
            }
            obj.setElement(source, null, null);
            obj.setCoords();
            this.canvas.renderAll();
        });
    }

    find(obj: any) {
        return this.findById(obj.id);
    }

    findById(id: string): IStaticObject | null {
        let findObject;
        const exist = this.canvas.getObjects().some((obj: IStaticObject) => {
            if (obj.id === id) {
                findObject = obj;
                return true;
            }
            return false;
        });
        if (!exist) {
            console.warn('Not found object by id.');
            return null;
        }
        return findObject;
    }

    findOriginById(id: string): IStaticObject | null {
        let findObject;
        const exist = this.objects.some((obj) => {
            if (obj.id === id) {
                findObject = obj;
                return true;
            }
            return false;
        });
        if (!exist) {
            console.warn('Not found object by id.');
            return null;
        }
        return findObject;
    }

    findOriginByIdWithIndex(id: string): { object: IStaticObject, index: number } {
        let findObject;
        let index;
        const exist = this.objects.some((obj, i) => {
            if (obj.id === id) {
                findObject = obj;
                index = i;
                return true;
            }
            return false;
        });
        if (!exist) {
            console.warn('Not found object by id.');
            return null;
        }
        return {
            object: findObject,
            index,
        };
    }

    allSelect() {
        const { canvas } = this;
        canvas.discardActiveObject();
        const filteredObjects = canvas.getObjects().filter((obj: IStaticObject) => {
            if (obj.id === 'workarea') {
                return false;
            }
            if (!obj.evented) {
                return false;
            }
            if (this.isElementType(obj.type)) {
                return false;
            }
            if (obj.lock) {
                return false;
            }
            return true;
        });
        if (!filteredObjects.length) {
            return;
        }
        if (filteredObjects.length === 1) {
            canvas.setActiveObject(filteredObjects[0]);
            canvas.renderAll();
            return;
        }
        const activeSelection = new fabric.ActiveSelection(filteredObjects, {
            canvas: this.canvas,
            ...this.activeSelection,
        });
        canvas.setActiveObject(activeSelection);
        canvas.renderAll();
    }

    select(obj: any) {
        const findObject = this.find(obj);
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    }

    selectById(id: string) {
        const findObject = this.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    }

    originScaleToResize(obj: any, width: number, height: number) {
        if (obj.id === 'workarea') {
            this.setById(obj.id, 'workareaWidth', obj.width);
            this.setById(obj.id, 'workareaHeight', obj.height);
        }
        this.setById(obj.id, 'scaleX', width / obj.width);
        this.setById(obj.id, 'scaleY', height / obj.height);
    }

    scaleToResize(width: number, height: number) {
        const activeObject = this.canvas.getActiveObject() as IStaticObject;
        if (activeObject) {
            const obj = {
                id: activeObject.id,
                scaleX: width / activeObject.width,
                scaleY: height / activeObject.height,
            };
            this.setObject(obj);
            activeObject.setCoords();
            this.canvas.requestRenderAll();
        }
    }

    importJSON(json: any, callback: any) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let prevLeft = 0;
        let prevTop = 0;
        this.canvas.setBackgroundColor(this.canvasOption.backgroundColor, null);
        const workareaExist = json.filter((obj: IStaticObject) => obj.id === 'workarea');
        // if (!this.workarea) {
        //     this.workarea = new fabric.Image(null, {
        //         ...defaultWorkareaOption,
        //         ...this.workareaOption,
        //     }) as IStaticWorkarea;
        //     this.canvas.add(this.workarea);
        //     this.objects.push(this.workarea);
        // }
        console.log(this.canvas);
        if (!workareaExist.length) {
            this.canvas.centerObject(this.workarea);
            this.workarea.setCoords();
            prevLeft = this.workarea.left;
            prevTop = this.workarea.top;
        } else {
            const workarea = workareaExist[0];
            prevLeft = workarea.left;
            prevTop = workarea.top;
            this.workarea.set(workarea);
            this.canvas.centerObject(this.workarea);
            this.canvas.workareaTools.setImage(workarea.src, true);
            this.workarea.setCoords();
            console.log(this.workarea);
        }
        setTimeout(() => {
            json.forEach((obj: IStaticObject) => {
                if (obj.id === 'workarea') {
                    return;
                }
                const canvasWidth = this.canvas.getWidth();
                const canvasHeight = this.canvas.getHeight();
                const { width, height, scaleX, scaleY, layout, left, top } = this.workarea;
                if (layout === 'fullscreen') {
                    const leftRatio = canvasWidth / (width * scaleX);
                    const topRatio = canvasHeight / (height * scaleY);
                    obj.left *= leftRatio;
                    obj.top *= topRatio;
                    obj.scaleX *= leftRatio;
                    obj.scaleY *= topRatio;
                } else {
                    const diffLeft = left - prevLeft;
                    const diffTop = top - prevTop;
                    obj.left += diffLeft;
                    obj.top += diffTop;
                }
                if (this.isElementType(obj.type)) {
                    obj.id = uuid();
                }
                this.add(obj, false, true);
                this.canvas.renderAll();
            });
            if (callback) {
                callback(this.canvas);
            }
        }, 300);
        this.canvas.setZoom(1);
    }

    exportJSON(): string {
        return this.canvas.toDatalessJSON(this.propertiesToInclude);
    }

    getObjects(): IStaticObject[] {
        return this.canvas.getObjects().filter((obj: IStaticObject) => {
            if (obj.id === 'workarea') {
                return false;
            } else if (obj.id === 'grid') {
                return false;
            } else if (obj.superType === 'port') {
                return false;
            } else if (!obj.id) {
                return false;
            }
            return true;
        });
    }

    getOriginObjects(): IStaticObject[] {
        return this.objects;
    }

    bringForward() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.bringForward(activeObject);
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    }

    bringToFront() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.bringToFront(activeObject);
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    }

    sendBackwards() {
        const activeObject = this.canvas.getActiveObject() as IStaticObject;
        if (activeObject) {
            const objects = this.canvas.getObjects() as IStaticObject[];
            if (objects[1].id === activeObject.id) {
                return;
            }
            this.canvas.sendBackwards(activeObject);
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    }

    sendToBack() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.sendToBack(activeObject);
            this.canvas.sendToBack(this.canvas.getObjects()[1]);
            const { onModified } = this;
            if (onModified) {
                onModified(activeObject);
            }
        }
    }

    clear(isWorkarea = false) {
        const { canvas } = this;
        const ids = canvas.getObjects().reduce((prev, curr: IStaticObject) => {
            if (this.isElementType(curr.type)) {
                prev.push(curr.id);
                return prev;
            }
            return prev;
        }, []);
        this.canvas.elementTools.removeByIds(ids);
        if (isWorkarea) {
            canvas.clear();
            // this.workarea = null;
        } else {
            canvas.getObjects().forEach((obj: IStaticObject) => {
                if (obj.id !== 'workarea') {
                    canvas.remove(obj);
                }
            });
        }
    }

    toGroup() {
        const { canvas } = this;
        if (!canvas.getActiveObject()) {
            return;
        }
        if (canvas.getActiveObject().type !== 'activeSelection') {
            return;
        }
        const activeObject = canvas.getActiveObject() as fabric.ActiveSelection;
        const group = activeObject.toGroup();
        group.set({
            id: uuid(),
            name: 'New group',
            ...this.defaultOptions,
        });
        const { onSelect } = this;
        if (onSelect) {
            onSelect(group);
        }
        canvas.renderAll();
    }

    toActiveSelection() {
        const { canvas } = this;
        if (!canvas.getActiveObject()) {
            return;
        }
        if (canvas.getActiveObject().type !== 'group') {
            return;
        }
        const activeObject = canvas.getActiveObject() as fabric.Group;
        const activeSelection = activeObject.toActiveSelection();
        const { onSelect } = this;
        if (onSelect) {
            onSelect(activeSelection);
        }
        canvas.renderAll();
    }

    isElementType(type: string): boolean {
        return type === 'video' || type === 'element' || type === 'iframe';
    }
}

export default GeneralTools;
