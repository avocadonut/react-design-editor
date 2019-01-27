import { fabric } from 'fabric';

import { ITools } from './Tools';
import { IStaticObject, IStaticCanvas, IWorkareaOption, ICanvasProps } from '../Canvas';

export interface IGeneralTools extends ITools {
    centerObject(obj: IStaticObject, centered?: boolean): void;
    add(obj: any, centered?: boolean, loaded?: boolean): IStaticObject | null;
    addGroup(obj: any, centered?: boolean, loaded?: boolean): void;
    addImage(obj: any, centered?: boolean, loaded?: boolean): void;
    addElement(obj: any, centered?: boolean, loaded?: boolean): void;
    remove(): void;
    removeById(id: string): void;
    removeOriginById(): void;
    duplicate(): void;
    duplicateById(): void;
    copy(): void;
    paste(): void;
    set(): void;
    setObject(): void;
    setByObject(): void;
    setById(): void;
    setShadow(): void;
    setImage(): void;
    setImageById(): void;
    loadImage(): void;
    find(): void;
    findById(): void;
    findOriginById(): void;
    findOriginByIdWithIndex(): void;
    allSelect(): void;
    select(): void;
    selectById(): void;
    originScaleToResize(): void;
    scaleToResize(): void;
    importJSON(): void;
    exportJSON(): void;
    getObjects(): void;
    getOriginObjects(): void;
    bringForward(): void;
    bringToFront(): void;
    sendBackwards(): void;
    sendToBack(): void;
    clear(): void;
    toGroup(): void;
    toActiveSelection(): void;
    isElementType(type: string): boolean;
}

class GeneralTools implements IGeneralTools {
    canvas: IStaticCanvas;
    workarea: IWorkareaOption;
    props?: ICanvasProps;
    objects: IStaticObject[];
    fabricObjects: any;

    constructor(canvas: IStaticCanvas, workarea: IWorkareaOption,
        objects: IStaticObject[], fabricObjects: any, props: ICanvasProps) {
        this.canvas = canvas;
        this.workarea = workarea;
        this.objects = objects;
        this.fabricObjects = fabricObjects;
        this.props = props;
    }

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
            const { onAdd } = this.props;
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
        const { onAdd } = this.props;
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
        return obj.objects.map((child) => {
            return this.add(child, centered, loaded);
        });
    }

    addImage(obj: any, centered?: boolean, loaded?: boolean): void {
        const { editable } = this.props;
        const image = new Image();
        const { src, file, ...otherOption } = obj;
        const createImage = (img) => {
            const createdObj = new fabric.Image(img, {
                src,
                file,
                ...this.props.defaultOptions,
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
            const { onAdd } = this.props;
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
        reader.onload = (e) => {
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
            ...this.props.defaultOptions,
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
        const { onAdd } = this.props;
        if (onAdd && editable && !loaded) {
            onAdd(createdObj);
        }
    }

    remove(): void {
        const activeObject = this.canvas.getActiveObject();
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
            activeObjects.forEach((obj) => {
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
        const { onRemove } = this.props;
        if (onRemove) {
            onRemove(activeObject);
        }
    }

    removeById(id: string) {
        const findObject = this.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            const { onRemove } = this.props;
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

    isElementType(type: string): boolean {
        return type === 'video' || type === 'element' || type === 'iframe';
    }
}

export default GeneralTools;
