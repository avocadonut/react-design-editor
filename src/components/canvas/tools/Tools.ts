class Tools {
    public static centerObject(obj, centered) {
        if (centered) {
            this.canvas.centerObject(obj);
            obj.setCoords();
        } else {
            this.handlers.setByObject(obj, 'left', (obj.left / this.canvas.getZoom()) - (obj.width / 2) - (this.canvas.viewportTransform[4] / this.canvas.getZoom()));
            this.handlers.setByObject(obj, 'top', (obj.top / this.canvas.getZoom()) - (obj.height / 2) - (this.canvas.viewportTransform[5] / this.canvas.getZoom()));
        }
    }

    add(obj, centered = true, loaded = false) {
        const { editable } = this.props;
        const option = {
            hasControls: editable,
            hasBorders: editable,
            selection: editable,
            lockMovementX: !editable,
            lockMovementY: !editable,
            hoverCursor: !editable ? 'pointer' : 'move',
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
            const objects = this.handlers.addGroup(newOption, centered, loaded);
            const groupOption = Object.assign({}, newOption, { objects });
            if (obj.type === 'image') {
                this.handlers.addImage(newOption, centered, loaded);
                return;
            }
            if (this.handlers.isElementType(obj.type)) {
                this.handlers.addElement(newOption, centered);
                return;
            }
            createdObj = this.fabricObjects[obj.type].create({ ...groupOption });
            if (!editable && !this.handlers.isElementType(obj.type)) {
                createdObj.on('mousedown', this.eventHandlers.object.mousedown);
            }
            this.canvas.add(createdObj);
            this.objects.push(createdObj);
            if (obj.type !== 'polygon' && editable && !loaded) {
                this.handlers.centerObject(createdObj, centered);
            }
            if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                this.animationHandlers.play(createdObj.id);
            }
            const { onAdd } = this.props;
            if (onAdd && editable && !loaded) {
                onAdd(createdObj);
            }
            return createdObj;
        }
        if (obj.type === 'image') {
            this.handlers.addImage(newOption, centered, loaded);
            return;
        }
        if (this.handlers.isElementType(obj.type)) {
            this.handlers.addElement(newOption, centered);
            return;
        }
        if (obj.superType === 'link') {
            return this.linkHandlers.create({ ...newOption });
        }
        createdObj = this.fabricObjects[obj.type].create({ ...newOption });
        if (!editable && !this.handlers.isElementType(obj.type)) {
            createdObj.on('mousedown', this.eventHandlers.object.mousedown);
        }
        this.canvas.add(createdObj);
        this.objects.push(createdObj);
        if (obj.type !== 'polygon' && obj.superType !== 'link' && editable && !loaded) {
            this.handlers.centerObject(createdObj, centered);
        }
        if (createdObj.superType === 'node') {
            this.portHandlers.createPort(createdObj);
            if (createdObj.iconButton) {
                this.canvas.add(createdObj.iconButton);
            }
        }
        if (!editable && createdObj.animation && createdObj.animation.autoplay) {
            this.animationHandlers.play(createdObj.id);
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
                this.nodeHandlers.highlightingNode(createdObj);
            }
        }
        return createdObj;
    }

    addGroup(obj, centered = true, loaded = false) {
        return obj.objects.map((child) => {
            return this.handlers.add(child, centered, loaded);
        });
    }

    addImage(obj, centered = true, loaded = false) {
        const { editable } = this.props;
        const image = new Image();
        const { src, file, ...otherOption } = obj;
        const createImage = (img) => {
            const createdObj = new fabric.Image(img, {
                src,
                file,
                ...this.props.defaultOptions,
                ...otherOption,
            });
            if (!editable) {
                createdObj.on('mousedown', this.eventHandlers.object.mousedown);
            }
            this.canvas.add(createdObj);
            this.objects.push(createdObj);
            if (editable && !loaded) {
                this.handlers.centerObject(createdObj, centered);
            }
            if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                this.animationHandlers.play(createdObj.id);
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

    addElement(obj, centered = true, loaded = false) {
        const { canvas } = this;
        const { editable } = this.props;
        const { src, file, code, ...otherOption } = obj;
        const createdObj = new fabric.Rect({
            src,
            file,
            code,
            ...this.props.defaultOptions,
            ...otherOption,
            fill: 'rgba(255, 255, 255, 0)',
            stroke: 'rgba(255, 255, 255, 0)',
        });
        if (!editable) {
            createdObj.on('mousedown', this.eventHandlers.object.mousedown);
        }
        canvas.add(createdObj);
        this.objects.push(createdObj);
        if (src || file || code) {
            if (obj.type === 'video') {
                this.videoHandlers.set(createdObj, src || file);
            } else {
                this.elementHandlers.set(createdObj, src || code);
            }
        }
        if (editable && !loaded) {
            this.handlers.centerObject(createdObj, centered);
        }
        const { onAdd } = this.props;
        if (onAdd && editable && !loaded) {
            onAdd(createdObj);
        }
    }

    remove() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        if (activeObject.type !== 'activeSelection') {
            this.canvas.discardActiveObject();
            if (this.handlers.isElementType(activeObject.type)) {
                this.elementHandlers.removeById(activeObject.id);
                this.elementHandlers.removeStyleById(activeObject.id);
                this.elementHandlers.removeScriptById(activeObject.id);
            }
            if (activeObject.superType === 'link') {
                this.linkHandlers.remove(activeObject);
            } else if (activeObject.superType === 'node') {
                if (activeObject.toPort) {
                    if (activeObject.toPort.links.length) {
                        activeObject.toPort.links.forEach((link) => {
                            this.linkHandlers.remove(link, 'from');
                        });
                    }
                    this.canvas.remove(activeObject.toPort);
                }
                if (activeObject.fromPort && activeObject.fromPort.length) {
                    activeObject.fromPort.forEach((port) => {
                        if (port.links.length) {
                            port.links.forEach((link) => {
                                this.linkHandlers.remove(link, 'to');
                            });
                        }
                        this.canvas.remove(port);
                    });
                }
            }
            this.canvas.remove(activeObject);
            this.handlers.removeOriginById(activeObject.id);
        } else {
            const { _objects: activeObjects } = activeObject;
            this.canvas.discardActiveObject();
            activeObjects.forEach((obj) => {
                if (this.handlers.isElementType(obj.type)) {
                    this.elementHandlers.removeById(obj.id);
                    this.elementHandlers.removeStyleById(obj.id);
                    this.elementHandlers.removeScriptById(obj.id);
                } else if (obj.superType === 'node') {
                    this.canvas.remove(obj.toPort);
                    obj.fromPort.forEach((port) => {
                        this.canvas.remove(port);
                    });
                }
                this.canvas.remove(obj);
                this.handlers.removeOriginById(obj.id);
            });
        }
        const { onRemove } = this.props;
        if (onRemove) {
            onRemove(activeObject);
        }
    }

    removeById(id) {
        const findObject = this.handlers.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            const { onRemove } = this.props;
            if (onRemove) {
                onRemove(findObject);
            }
            if (this.handlers.isElementType(findObject.type)) {
                this.elementHandlers.removeById(findObject.id);
                this.elementHandlers.removeStyleById(findObject.id);
                this.elementHandlers.removeScriptById(findObject.id);
            }
            this.canvas.remove(findObject);
            this.handlers.removeOriginById(findObject.id);
        }
    }

    duplicate() {
        const { onAdd, propertiesToInclude } = this.props;
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
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
            this.portHandlers.createPort(clonedObj);
            this.canvas.requestRenderAll();
        }, propertiesToInclude);
    }

    duplicateById(id) {
        const { onAdd, propertiesToInclude } = this.props;
        const findObject = this.handlers.findById(id);
        if (findObject) {
            findObject.clone((cloned) => {
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
                this.portHandlers.createPort(cloned);
                this.canvas.requestRenderAll();
            }, propertiesToInclude);
        }
    }

    copy() {
        const { propertiesToInclude } = this.props;
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.superType === 'link') {
            return false;
        }
        if (activeObject) {
            activeObject.clone((cloned) => {
                this.setState({
                    clipboard: cloned,
                });
            }, propertiesToInclude);
        }
    }

    paste() {
        const { onAdd, propertiesToInclude } = this.props;
        const { clipboard } = this.state;
        if (!clipboard) {
            return false;
        }
        clipboard.clone((clonedObj) => {
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
            this.setState({
                clipboard: newClipboard,
            });
            this.canvas.setActiveObject(clonedObj);
            this.portHandlers.createPort(clonedObj);
            this.canvas.requestRenderAll();
        }, propertiesToInclude);
    }

    set(key, value) {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        activeObject.set(key, value);
        activeObject.setCoords();
        this.canvas.requestRenderAll();
        const { onModified } = this.props;
        if (onModified) {
            onModified(activeObject);
        }
    }

    setObject(option) {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        Object.keys(option).forEach((key) => {
            if (option[key] !== activeObject[key]) {
                activeObject.set(key, option[key]);
                activeObject.setCoords();
            }
        });
        this.canvas.requestRenderAll();
        const { onModified } = this.props;
        if (onModified) {
            onModified(activeObject);
        }
    }

    setByObject(obj, key, value) {
        if (!obj) {
            return;
        }
        obj.set(key, value);
        obj.setCoords();
        this.canvas.renderAll();
        const { onModified } = this.props;
        if (onModified) {
            onModified(obj);
        }
    }

    setById(id, key, value) {
        const findObject = this.handlers.findById(id);
        this.handlers.setByObject(findObject, key, value);
    }

    setShadow(key, value) {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        activeObject.setShadow(value);
        this.canvas.requestRenderAll();
        const { onModified } = this.props;
        if (onModified) {
            onModified(activeObject);
        }
    }

    loadImage(obj, src) {
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
            obj.setElement(source);
            obj.setCoords();
            this.canvas.renderAll();
        });
    }

    setImage(obj, src) {
        if (!src) {
            this.handlers.loadImage(obj, null);
            obj.set('file', null);
            obj.set('src', null);
            return;
        }
        if (typeof src === 'string') {
            this.handlers.loadImage(obj, src);
            obj.set('file', null);
            obj.set('src', src);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.handlers.loadImage(obj, e.target.result);
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

    setImageById(id, source) {
        const findObject = this.handlers.findById(id);
        this.handlers.setImage(findObject, source);
    }

    find(obj) {
        return this.handlers.findById(obj.id);
    }

    findById(id) {
        let findObject;
        const exist = this.canvas.getObjects().some((obj) => {
            if (obj.id === id) {
                findObject = obj;
                return true;
            }
            return false;
        });
        if (!exist) {
            console.warn('Not found object by id.');
            return exist;
        }
        return findObject;
    }

    allSelect() {
        const { canvas } = this;
        canvas.discardActiveObject();
        const filteredObjects = canvas.getObjects().filter((obj) => {
            if (obj.id === 'workarea') {
                return false;
            }
            if (!obj.evented) {
                return false;
            }
            if (this.handlers.isElementType(obj.type)) {
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
            canvas,
            ...this.props.activeSelection,
        });
        canvas.setActiveObject(activeSelection);
        canvas.renderAll();
    }

    select(obj) {
        const findObject = this.handlers.find(obj);
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    }

    selectById(id) {
        const findObject = this.handlers.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    }

    originScaleToResize(obj, width, height) {
        if (obj.id === 'workarea') {
            this.handlers.setById(obj.id, 'workareaWidth', obj.width);
            this.handlers.setById(obj.id, 'workareaHeight', obj.height);
        }
        this.handlers.setById(obj.id, 'scaleX', width / obj.width);
        this.handlers.setById(obj.id, 'scaleY', height / obj.height);
    }

    scaleToResize(width, height) {
        const activeObject = this.canvas.getActiveObject();
        const obj = {
            id: activeObject.id,
            scaleX: width / activeObject.width,
            scaleY: height / activeObject.height,
        };
        this.handlers.setObject(obj);
        activeObject.setCoords();
        this.canvas.requestRenderAll();
    }

    importJSON(json, callback) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let prevLeft = 0;
        let prevTop = 0;
        this.canvas.setBackgroundColor(this.props.canvasOption.backgroundColor);
        const workareaExist = json.filter(obj => obj.id === 'workarea');
        if (!this.workarea) {
            this.workarea = new fabric.Image(null, {
                ...defaultWorkareaOption,
                ...this.props.workareaOption,
            });
            this.canvas.add(this.workarea);
            this.objects.push(this.workarea);
        }
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
            this.workareaHandlers.setImage(workarea.src, true);
            this.workarea.setCoords();
        }
        setTimeout(() => {
            json.forEach((obj) => {
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
                if (this.handlers.isElementType(obj.type)) {
                    obj.id = uuid();
                }
                this.handlers.add(obj, false, true);
                this.canvas.renderAll();
            });
            if (callback) {
                callback(this.canvas);
            }
        }, 300);
        this.canvas.setZoom(1);
    }

    exportJSON() {
        return this.canvas.toDatalessJSON(this.props.propertiesToInclude);
    }
    
    getObjects() {
        return this.canvas.getObjects().filter((obj) => {
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
        })
    }

    bringForward() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.bringForward(activeObject);
            const { onModified } = this.props;
            if (onModified) {
                onModified(activeObject);
            }
        }
    }

    bringToFront() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.bringToFront(activeObject);
            const { onModified } = this.props;
            if (onModified) {
                onModified(activeObject);
            }
        }
    }

    sendBackwards() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            if (this.canvas.getObjects()[1].id === activeObject.id) {
                return;
            }
            this.canvas.sendBackwards(activeObject);
            const { onModified } = this.props;
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
            const { onModified } = this.props;
            if (onModified) {
                onModified(activeObject);
            }
        }
    }

    clear(workarea = false) {
        const { canvas } = this;
        const ids = canvas.getObjects().reduce((prev, curr) => {
            if (this.handlers.isElementType(curr.type)) {
                prev.push(curr.id);
                return prev;
            }
            return prev;
        }, []);
        this.elementHandlers.removeByIds(ids);
        if (workarea) {
            canvas.clear();
            this.workarea = null;
        } else {
            canvas.getObjects().forEach((obj) => {
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
        const group = canvas.getActiveObject().toGroup();
        group.set({
            id: uuid(),
            name: 'New group',
            ...this.props.defaultOptions,
        });
        const { onSelect } = this.props;
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
        const activeObject = canvas.getActiveObject().toActiveSelection();
        const { onSelect } = this.props;
        if (onSelect) {
            onSelect(activeObject);
        }
        canvas.renderAll();
    }

    static isElementType(type) {
        return type === 'video' || type === 'element' || type === 'iframe';
    }

    static getOriginObjects() {
        return this.objects;
    }

    static findOriginById(id) {
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
            return exist;
        }
        return findObject;
    }

    static findOriginByIdWithIndex(id) {
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
            return exist;
        }
        return {
            object: findObject,
            index,
        };
    }

    static removeOriginById(id) {
        const object = this.findOriginByIdWithIndex(id);
        if (object) {
            this.objects.splice(object.index, 1);
        }
    }
}

export default Tools;
