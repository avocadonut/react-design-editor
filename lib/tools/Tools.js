"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.centerObject = function (obj, centered) {
        if (centered) {
            this.canvas.centerObject(obj);
            obj.setCoords();
        }
        else {
            this.handlers.setByObject(obj, 'left', (obj.left / this.canvas.getZoom()) - (obj.width / 2) - (this.canvas.viewportTransform[4] / this.canvas.getZoom()));
            this.handlers.setByObject(obj, 'top', (obj.top / this.canvas.getZoom()) - (obj.height / 2) - (this.canvas.viewportTransform[5] / this.canvas.getZoom()));
        }
    };
    Tools.prototype.add = function (obj, centered, loaded) {
        if (centered === void 0) { centered = true; }
        if (loaded === void 0) { loaded = false; }
        var editable = this.props.editable;
        var option = {
            hasControls: editable,
            hasBorders: editable,
            selection: editable,
            lockMovementX: !editable,
            lockMovementY: !editable,
            hoverCursor: !editable ? 'pointer' : 'move',
        };
        if (obj.type === 'i-text') {
            option.editable = false;
        }
        else {
            option.editable = editable;
        }
        if (editable && this.workarea.layout === 'fullscreen') {
            option.scaleX = this.workarea.scaleX;
            option.scaleY = this.workarea.scaleY;
        }
        var newOption = Object.assign({}, option, obj);
        var createdObj;
        if (obj.type === 'group') {
            var objects = this.handlers.addGroup(newOption, centered, loaded);
            var groupOption = Object.assign({}, newOption, { objects: objects });
            if (obj.type === 'image') {
                this.handlers.addImage(newOption, centered, loaded);
                return;
            }
            if (this.handlers.isElementType(obj.type)) {
                this.handlers.addElement(newOption, centered);
                return;
            }
            createdObj = this.fabricObjects[obj.type].create(__assign({}, groupOption));
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
            var onAdd_1 = this.props.onAdd;
            if (onAdd_1 && editable && !loaded) {
                onAdd_1(createdObj);
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
            return this.linkHandlers.create(__assign({}, newOption));
        }
        createdObj = this.fabricObjects[obj.type].create(__assign({}, newOption));
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
        var onAdd = this.props.onAdd;
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
    };
    Tools.prototype.addGroup = function (obj, centered, loaded) {
        var _this = this;
        if (centered === void 0) { centered = true; }
        if (loaded === void 0) { loaded = false; }
        return obj.objects.map(function (child) {
            return _this.handlers.add(child, centered, loaded);
        });
    };
    Tools.prototype.addImage = function (obj, centered, loaded) {
        var _this = this;
        if (centered === void 0) { centered = true; }
        if (loaded === void 0) { loaded = false; }
        var editable = this.props.editable;
        var image = new Image();
        var src = obj.src, file = obj.file, otherOption = __rest(obj, ["src", "file"]);
        var createImage = function (img) {
            var createdObj = new fabric.Image(img, __assign({ src: src,
                file: file }, _this.props.defaultOptions, otherOption));
            if (!editable) {
                createdObj.on('mousedown', _this.eventHandlers.object.mousedown);
            }
            _this.canvas.add(createdObj);
            _this.objects.push(createdObj);
            if (editable && !loaded) {
                _this.handlers.centerObject(createdObj, centered);
            }
            if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                _this.animationHandlers.play(createdObj.id);
            }
            var onAdd = _this.props.onAdd;
            if (onAdd && editable && !loaded) {
                onAdd(createdObj);
            }
        };
        if (src) {
            image.onload = function () {
                createImage(image);
            };
            image.src = src;
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            image.onload = function () {
                createImage(image);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };
    Tools.prototype.addElement = function (obj, centered, loaded) {
        if (centered === void 0) { centered = true; }
        if (loaded === void 0) { loaded = false; }
        var canvas = this.canvas;
        var editable = this.props.editable;
        var src = obj.src, file = obj.file, code = obj.code, otherOption = __rest(obj, ["src", "file", "code"]);
        var createdObj = new fabric.Rect(__assign({ src: src,
            file: file,
            code: code }, this.props.defaultOptions, otherOption, { fill: 'rgba(255, 255, 255, 0)', stroke: 'rgba(255, 255, 255, 0)' }));
        if (!editable) {
            createdObj.on('mousedown', this.eventHandlers.object.mousedown);
        }
        canvas.add(createdObj);
        this.objects.push(createdObj);
        if (src || file || code) {
            if (obj.type === 'video') {
                this.videoHandlers.set(createdObj, src || file);
            }
            else {
                this.elementHandlers.set(createdObj, src || code);
            }
        }
        if (editable && !loaded) {
            this.handlers.centerObject(createdObj, centered);
        }
        var onAdd = this.props.onAdd;
        if (onAdd && editable && !loaded) {
            onAdd(createdObj);
        }
    };
    Tools.prototype.remove = function () {
        var _this = this;
        var activeObject = this.canvas.getActiveObject();
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
            }
            else if (activeObject.superType === 'node') {
                if (activeObject.toPort) {
                    if (activeObject.toPort.links.length) {
                        activeObject.toPort.links.forEach(function (link) {
                            _this.linkHandlers.remove(link, 'from');
                        });
                    }
                    this.canvas.remove(activeObject.toPort);
                }
                if (activeObject.fromPort && activeObject.fromPort.length) {
                    activeObject.fromPort.forEach(function (port) {
                        if (port.links.length) {
                            port.links.forEach(function (link) {
                                _this.linkHandlers.remove(link, 'to');
                            });
                        }
                        _this.canvas.remove(port);
                    });
                }
            }
            this.canvas.remove(activeObject);
            this.handlers.removeOriginById(activeObject.id);
        }
        else {
            var activeObjects = activeObject._objects;
            this.canvas.discardActiveObject();
            activeObjects.forEach(function (obj) {
                if (_this.handlers.isElementType(obj.type)) {
                    _this.elementHandlers.removeById(obj.id);
                    _this.elementHandlers.removeStyleById(obj.id);
                    _this.elementHandlers.removeScriptById(obj.id);
                }
                else if (obj.superType === 'node') {
                    _this.canvas.remove(obj.toPort);
                    obj.fromPort.forEach(function (port) {
                        _this.canvas.remove(port);
                    });
                }
                _this.canvas.remove(obj);
                _this.handlers.removeOriginById(obj.id);
            });
        }
        var onRemove = this.props.onRemove;
        if (onRemove) {
            onRemove(activeObject);
        }
    };
    Tools.prototype.removeById = function (id) {
        var findObject = this.handlers.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            var onRemove = this.props.onRemove;
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
    };
    Tools.prototype.duplicate = function () {
        var _this = this;
        var _a = this.props, onAdd = _a.onAdd, propertiesToInclude = _a.propertiesToInclude;
        var activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        activeObject.clone(function (clonedObj) {
            _this.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = _this.canvas;
                clonedObj.forEachObject(function (obj) {
                    obj.set('name', obj.name + "_clone");
                    obj.set('id', uuid());
                    _this.canvas.add(obj);
                    _this.objects.push(obj);
                });
                if (onAdd) {
                    onAdd(clonedObj);
                }
                clonedObj.setCoords();
            }
            else {
                clonedObj.set('name', clonedObj.name + "_clone");
                clonedObj.set('id', uuid());
                _this.canvas.add(clonedObj);
                _this.objects.push(clonedObj);
                if (onAdd) {
                    onAdd(clonedObj);
                }
            }
            _this.canvas.setActiveObject(clonedObj);
            _this.portHandlers.createPort(clonedObj);
            _this.canvas.requestRenderAll();
        }, propertiesToInclude);
    };
    Tools.prototype.duplicateById = function (id) {
        var _this = this;
        var _a = this.props, onAdd = _a.onAdd, propertiesToInclude = _a.propertiesToInclude;
        var findObject = this.handlers.findById(id);
        if (findObject) {
            findObject.clone(function (cloned) {
                cloned.set({
                    left: cloned.left + 10,
                    top: cloned.top + 10,
                    id: uuid(),
                    name: cloned.name + "_clone",
                    evented: true,
                });
                _this.canvas.add(cloned);
                _this.objects.push(cloned);
                if (onAdd) {
                    onAdd(cloned);
                }
                _this.canvas.setActiveObject(cloned);
                _this.portHandlers.createPort(cloned);
                _this.canvas.requestRenderAll();
            }, propertiesToInclude);
        }
    };
    Tools.prototype.copy = function () {
        var _this = this;
        var propertiesToInclude = this.props.propertiesToInclude;
        var activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.superType === 'link') {
            return false;
        }
        if (activeObject) {
            activeObject.clone(function (cloned) {
                _this.setState({
                    clipboard: cloned,
                });
            }, propertiesToInclude);
        }
    };
    Tools.prototype.paste = function () {
        var _this = this;
        var _a = this.props, onAdd = _a.onAdd, propertiesToInclude = _a.propertiesToInclude;
        var clipboard = this.state.clipboard;
        if (!clipboard) {
            return false;
        }
        clipboard.clone(function (clonedObj) {
            _this.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                id: uuid(),
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = _this.canvas;
                clonedObj.forEachObject(function (obj) {
                    obj.set('id', uuid());
                    obj.set('name', obj.name + "_clone");
                    _this.canvas.add(obj);
                    _this.objects.push(obj);
                });
                if (onAdd) {
                    onAdd(clonedObj);
                }
                clonedObj.setCoords();
            }
            else {
                clonedObj.set('id', uuid());
                clonedObj.set('name', clonedObj.name + "_clone");
                _this.canvas.add(clonedObj);
                _this.objects.push(clonedObj);
                if (onAdd) {
                    onAdd(clonedObj);
                }
            }
            var newClipboard = clipboard.set({
                top: clonedObj.top,
                left: clonedObj.left,
            });
            _this.setState({
                clipboard: newClipboard,
            });
            _this.canvas.setActiveObject(clonedObj);
            _this.portHandlers.createPort(clonedObj);
            _this.canvas.requestRenderAll();
        }, propertiesToInclude);
    };
    Tools.prototype.set = function (key, value) {
        var activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        activeObject.set(key, value);
        activeObject.setCoords();
        this.canvas.requestRenderAll();
        var onModified = this.props.onModified;
        if (onModified) {
            onModified(activeObject);
        }
    };
    Tools.prototype.setObject = function (option) {
        var activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        Object.keys(option).forEach(function (key) {
            if (option[key] !== activeObject[key]) {
                activeObject.set(key, option[key]);
                activeObject.setCoords();
            }
        });
        this.canvas.requestRenderAll();
        var onModified = this.props.onModified;
        if (onModified) {
            onModified(activeObject);
        }
    };
    Tools.prototype.setByObject = function (obj, key, value) {
        if (!obj) {
            return;
        }
        obj.set(key, value);
        obj.setCoords();
        this.canvas.renderAll();
        var onModified = this.props.onModified;
        if (onModified) {
            onModified(obj);
        }
    };
    Tools.prototype.setById = function (id, key, value) {
        var findObject = this.handlers.findById(id);
        this.handlers.setByObject(findObject, key, value);
    };
    Tools.prototype.setShadow = function (key, value) {
        var activeObject = this.canvas.getActiveObject();
        if (!activeObject) {
            return false;
        }
        activeObject.setShadow(value);
        this.canvas.requestRenderAll();
        var onModified = this.props.onModified;
        if (onModified) {
            onModified(activeObject);
        }
    };
    Tools.prototype.loadImage = function (obj, src) {
        var _this = this;
        fabric.util.loadImage(src, function (source) {
            if (obj.type !== 'image') {
                obj.setPatternFill({
                    source: source,
                    repeat: 'repeat',
                });
                obj.setCoords();
                _this.canvas.renderAll();
                return;
            }
            obj.setElement(source);
            obj.setCoords();
            _this.canvas.renderAll();
        });
    };
    Tools.prototype.setImage = function (obj, src) {
        var _this = this;
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
        }
        else {
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.handlers.loadImage(obj, e.target.result);
                var file = {
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
    };
    Tools.prototype.setImageById = function (id, source) {
        var findObject = this.handlers.findById(id);
        this.handlers.setImage(findObject, source);
    };
    Tools.prototype.find = function (obj) {
        return this.handlers.findById(obj.id);
    };
    Tools.prototype.findById = function (id) {
        var findObject;
        var exist = this.canvas.getObjects().some(function (obj) {
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
    };
    Tools.prototype.allSelect = function () {
        var _this = this;
        var canvas = this.canvas;
        canvas.discardActiveObject();
        var filteredObjects = canvas.getObjects().filter(function (obj) {
            if (obj.id === 'workarea') {
                return false;
            }
            if (!obj.evented) {
                return false;
            }
            if (_this.handlers.isElementType(obj.type)) {
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
        var activeSelection = new fabric.ActiveSelection(filteredObjects, __assign({ canvas: canvas }, this.props.activeSelection));
        canvas.setActiveObject(activeSelection);
        canvas.renderAll();
    };
    Tools.prototype.select = function (obj) {
        var findObject = this.handlers.find(obj);
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    };
    Tools.prototype.selectById = function (id) {
        var findObject = this.handlers.findById(id);
        if (findObject) {
            this.canvas.discardActiveObject();
            this.canvas.setActiveObject(findObject);
            this.canvas.requestRenderAll();
        }
    };
    Tools.prototype.originScaleToResize = function (obj, width, height) {
        if (obj.id === 'workarea') {
            this.handlers.setById(obj.id, 'workareaWidth', obj.width);
            this.handlers.setById(obj.id, 'workareaHeight', obj.height);
        }
        this.handlers.setById(obj.id, 'scaleX', width / obj.width);
        this.handlers.setById(obj.id, 'scaleY', height / obj.height);
    };
    Tools.prototype.scaleToResize = function (width, height) {
        var activeObject = this.canvas.getActiveObject();
        var obj = {
            id: activeObject.id,
            scaleX: width / activeObject.width,
            scaleY: height / activeObject.height,
        };
        this.handlers.setObject(obj);
        activeObject.setCoords();
        this.canvas.requestRenderAll();
    };
    Tools.prototype.importJSON = function (json, callback) {
        var _this = this;
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        var prevLeft = 0;
        var prevTop = 0;
        this.canvas.setBackgroundColor(this.props.canvasOption.backgroundColor);
        var workareaExist = json.filter(function (obj) { return obj.id === 'workarea'; });
        if (!this.workarea) {
            this.workarea = new fabric.Image(null, __assign({}, defaultWorkareaOption, this.props.workareaOption));
            this.canvas.add(this.workarea);
            this.objects.push(this.workarea);
        }
        if (!workareaExist.length) {
            this.canvas.centerObject(this.workarea);
            this.workarea.setCoords();
            prevLeft = this.workarea.left;
            prevTop = this.workarea.top;
        }
        else {
            var workarea = workareaExist[0];
            prevLeft = workarea.left;
            prevTop = workarea.top;
            this.workarea.set(workarea);
            this.canvas.centerObject(this.workarea);
            this.workareaHandlers.setImage(workarea.src, true);
            this.workarea.setCoords();
        }
        setTimeout(function () {
            json.forEach(function (obj) {
                if (obj.id === 'workarea') {
                    return;
                }
                var canvasWidth = _this.canvas.getWidth();
                var canvasHeight = _this.canvas.getHeight();
                var _a = _this.workarea, width = _a.width, height = _a.height, scaleX = _a.scaleX, scaleY = _a.scaleY, layout = _a.layout, left = _a.left, top = _a.top;
                if (layout === 'fullscreen') {
                    var leftRatio = canvasWidth / (width * scaleX);
                    var topRatio = canvasHeight / (height * scaleY);
                    obj.left *= leftRatio;
                    obj.top *= topRatio;
                    obj.scaleX *= leftRatio;
                    obj.scaleY *= topRatio;
                }
                else {
                    var diffLeft = left - prevLeft;
                    var diffTop = top - prevTop;
                    obj.left += diffLeft;
                    obj.top += diffTop;
                }
                if (_this.handlers.isElementType(obj.type)) {
                    obj.id = uuid();
                }
                _this.handlers.add(obj, false, true);
                _this.canvas.renderAll();
            });
            if (callback) {
                callback(_this.canvas);
            }
        }, 300);
        this.canvas.setZoom(1);
    };
    Tools.prototype.exportJSON = function () {
        return this.canvas.toDatalessJSON(this.props.propertiesToInclude);
    };
    Tools.prototype.getObjects = function () {
        return this.canvas.getObjects().filter(function (obj) {
            if (obj.id === 'workarea') {
                return false;
            }
            else if (obj.id === 'grid') {
                return false;
            }
            else if (obj.superType === 'port') {
                return false;
            }
            else if (!obj.id) {
                return false;
            }
            return true;
        });
    };
    Tools.prototype.bringForward = function () {
        var activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.bringForward(activeObject);
            var onModified = this.props.onModified;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };
    Tools.prototype.bringToFront = function () {
        var activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.bringToFront(activeObject);
            var onModified = this.props.onModified;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };
    Tools.prototype.sendBackwards = function () {
        var activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            if (this.canvas.getObjects()[1].id === activeObject.id) {
                return;
            }
            this.canvas.sendBackwards(activeObject);
            var onModified = this.props.onModified;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };
    Tools.prototype.sendToBack = function () {
        var activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.sendToBack(activeObject);
            this.canvas.sendToBack(this.canvas.getObjects()[1]);
            var onModified = this.props.onModified;
            if (onModified) {
                onModified(activeObject);
            }
        }
    };
    Tools.prototype.clear = function (workarea) {
        var _this = this;
        if (workarea === void 0) { workarea = false; }
        var canvas = this.canvas;
        var ids = canvas.getObjects().reduce(function (prev, curr) {
            if (_this.handlers.isElementType(curr.type)) {
                prev.push(curr.id);
                return prev;
            }
            return prev;
        }, []);
        this.elementHandlers.removeByIds(ids);
        if (workarea) {
            canvas.clear();
            this.workarea = null;
        }
        else {
            canvas.getObjects().forEach(function (obj) {
                if (obj.id !== 'workarea') {
                    canvas.remove(obj);
                }
            });
        }
    };
    Tools.prototype.toGroup = function () {
        var canvas = this.canvas;
        if (!canvas.getActiveObject()) {
            return;
        }
        if (canvas.getActiveObject().type !== 'activeSelection') {
            return;
        }
        var group = canvas.getActiveObject().toGroup();
        group.set(__assign({ id: uuid(), name: 'New group' }, this.props.defaultOptions));
        var onSelect = this.props.onSelect;
        if (onSelect) {
            onSelect(group);
        }
        canvas.renderAll();
    };
    Tools.prototype.toActiveSelection = function () {
        var canvas = this.canvas;
        if (!canvas.getActiveObject()) {
            return;
        }
        if (canvas.getActiveObject().type !== 'group') {
            return;
        }
        var activeObject = canvas.getActiveObject().toActiveSelection();
        var onSelect = this.props.onSelect;
        if (onSelect) {
            onSelect(activeObject);
        }
        canvas.renderAll();
    };
    Tools.isElementType = function (type) {
        return type === 'video' || type === 'element' || type === 'iframe';
    };
    Tools.getOriginObjects = function () {
        return this.objects;
    };
    Tools.findOriginById = function (id) {
        var findObject;
        var exist = this.objects.some(function (obj) {
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
    };
    Tools.findOriginByIdWithIndex = function (id) {
        var findObject;
        var index;
        var exist = this.objects.some(function (obj, i) {
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
            index: index,
        };
    };
    Tools.removeOriginById = function (id) {
        var object = this.findOriginByIdWithIndex(id);
        if (object) {
            this.objects.splice(object.index, 1);
        }
    };
    return Tools;
}());
exports.default = Tools;
