"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var fabric_1 = require("fabric");
var v4_1 = __importDefault(require("uuid/v4"));
var debounce_1 = __importDefault(require("lodash/debounce"));
require("mediaelement");
require("mediaelement/build/mediaelementplayer.min.css");
var interactjs_1 = __importDefault(require("interactjs"));
var animejs_1 = __importDefault(require("animejs"));
var CanvasObjects_1 = __importDefault(require("./CanvasObjects"));
var CurvedLink_1 = __importDefault(require("../workflow/link/CurvedLink"));
require("../../styles/core/tooltip.less");
require("../../styles/core/contextmenu.less");
var AlignmentTools_1 = __importDefault(require("./tools/AlignmentTools"));
var defaultCanvasOption = {
    preserveObjectStacking: true,
    width: 300,
    height: 150,
    selection: true,
    defaultCursor: 'default',
    backgroundColor: '#fff',
};
var defaultWorkareaOption = {
    width: 600,
    height: 400,
    workareaWidth: 600,
    workareaHeight: 400,
    lockScalingX: true,
    lockScalingY: true,
    scaleX: 1,
    scaleY: 1,
    backgroundColor: '#fff',
    hasBorders: false,
    hasControls: false,
    selectable: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
    name: '',
    id: 'workarea',
    type: 'image',
    layout: 'fixed',
};
var defaultKeyboardEvent = {
    move: true,
    all: true,
    copy: true,
    paste: true,
    esc: true,
    del: true,
};
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            id: v4_1.default(),
            clipboard: null,
        };
        _this.attachEventListener = function () {
            // if add canvas wrapper element event, tabIndex = 1000;
            _this.canvas.wrapperEl.tabIndex = 1000;
            document.addEventListener('keydown', _this.eventHandlers.keydown, false);
            document.addEventListener('paste', _this.eventHandlers.paste, false);
            document.addEventListener('mousedown', _this.eventHandlers.onmousedown, false);
            _this.canvas.wrapperEl.addEventListener('contextmenu', _this.eventHandlers.contextmenu, false);
        };
        _this.detachEventListener = function () {
            document.removeEventListener('keydown', _this.eventHandlers.keydown);
            document.removeEventListener('paste', _this.eventHandlers.paste);
            document.removeEventListener('mousedown', _this.eventHandlers.onmousedown);
            _this.canvas.wrapperEl.removeEventListener('contextmenu', _this.eventHandlers.contextmenu);
        };
        _this.handlers = {
            centerObject: function (obj, centered) {
                if (centered) {
                    _this.canvas.centerObject(obj);
                    obj.setCoords();
                }
                else {
                    _this.handlers.setByObject(obj, 'left', (obj.left / _this.canvas.getZoom()) - (obj.width / 2) - (_this.canvas.viewportTransform[4] / _this.canvas.getZoom()));
                    _this.handlers.setByObject(obj, 'top', (obj.top / _this.canvas.getZoom()) - (obj.height / 2) - (_this.canvas.viewportTransform[5] / _this.canvas.getZoom()));
                }
            },
            add: function (obj, centered, loaded) {
                if (centered === void 0) { centered = true; }
                if (loaded === void 0) { loaded = false; }
                var editable = _this.props.editable;
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
                if (editable && _this.workarea.layout === 'fullscreen') {
                    option.scaleX = _this.workarea.scaleX;
                    option.scaleY = _this.workarea.scaleY;
                }
                var newOption = Object.assign({}, option, obj);
                var createdObj;
                if (obj.type === 'group') {
                    var objects = _this.handlers.addGroup(newOption, centered, loaded);
                    var groupOption = Object.assign({}, newOption, { objects: objects });
                    if (obj.type === 'image') {
                        _this.handlers.addImage(newOption, centered, loaded);
                        return;
                    }
                    if (_this.handlers.isElementType(obj.type)) {
                        _this.handlers.addElement(newOption, centered);
                        return;
                    }
                    createdObj = _this.fabricObjects[obj.type].create(__assign({}, groupOption));
                    if (!editable && !_this.handlers.isElementType(obj.type)) {
                        createdObj.on('mousedown', _this.eventHandlers.object.mousedown);
                    }
                    _this.canvas.add(createdObj);
                    _this.objects.push(createdObj);
                    if (obj.type !== 'polygon' && editable && !loaded) {
                        _this.handlers.centerObject(createdObj, centered);
                    }
                    if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                        _this.animationHandlers.play(createdObj.id);
                    }
                    var onAdd_1 = _this.props.onAdd;
                    if (onAdd_1 && editable && !loaded) {
                        onAdd_1(createdObj);
                    }
                    return createdObj;
                }
                if (obj.type === 'image') {
                    _this.handlers.addImage(newOption, centered, loaded);
                    return;
                }
                if (_this.handlers.isElementType(obj.type)) {
                    _this.handlers.addElement(newOption, centered);
                    return;
                }
                if (obj.superType === 'link') {
                    return _this.linkHandlers.create(__assign({}, newOption));
                }
                createdObj = _this.fabricObjects[obj.type].create(__assign({}, newOption));
                if (!editable && !_this.handlers.isElementType(obj.type)) {
                    createdObj.on('mousedown', _this.eventHandlers.object.mousedown);
                }
                _this.canvas.add(createdObj);
                _this.objects.push(createdObj);
                if (obj.type !== 'polygon' && obj.superType !== 'link' && editable && !loaded) {
                    _this.handlers.centerObject(createdObj, centered);
                }
                if (createdObj.superType === 'node') {
                    _this.portHandlers.createPort(createdObj);
                    if (createdObj.iconButton) {
                        _this.canvas.add(createdObj.iconButton);
                    }
                }
                if (!editable && createdObj.animation && createdObj.animation.autoplay) {
                    _this.animationHandlers.play(createdObj.id);
                }
                var onAdd = _this.props.onAdd;
                if (onAdd && editable && !loaded) {
                    onAdd(createdObj);
                }
                if (!loaded) {
                    if (createdObj.superType === 'node') {
                        createdObj.setShadow({
                            color: createdObj.stroke,
                        });
                        _this.nodeHandlers.highlightingNode(createdObj);
                    }
                }
                return createdObj;
            },
            addGroup: function (obj, centered, loaded) {
                if (centered === void 0) { centered = true; }
                if (loaded === void 0) { loaded = false; }
                return obj.objects.map(function (child) {
                    return _this.handlers.add(child, centered, loaded);
                });
            },
            addImage: function (obj, centered, loaded) {
                if (centered === void 0) { centered = true; }
                if (loaded === void 0) { loaded = false; }
                var editable = _this.props.editable;
                var image = new Image();
                var src = obj.src, file = obj.file, otherOption = __rest(obj, ["src", "file"]);
                var createImage = function (img) {
                    var createdObj = new fabric_1.fabric.Image(img, __assign({ src: src,
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
            },
            addElement: function (obj, centered, loaded) {
                if (centered === void 0) { centered = true; }
                if (loaded === void 0) { loaded = false; }
                var canvas = _this.canvas;
                var editable = _this.props.editable;
                var src = obj.src, file = obj.file, code = obj.code, otherOption = __rest(obj, ["src", "file", "code"]);
                var createdObj = new fabric_1.fabric.Rect(__assign({ src: src,
                    file: file,
                    code: code }, _this.props.defaultOptions, otherOption, { fill: 'rgba(255, 255, 255, 0)', stroke: 'rgba(255, 255, 255, 0)' }));
                if (!editable) {
                    createdObj.on('mousedown', _this.eventHandlers.object.mousedown);
                }
                canvas.add(createdObj);
                _this.objects.push(createdObj);
                if (src || file || code) {
                    if (obj.type === 'video') {
                        _this.videoHandlers.set(createdObj, src || file);
                    }
                    else {
                        _this.elementHandlers.set(createdObj, src || code);
                    }
                }
                if (editable && !loaded) {
                    _this.handlers.centerObject(createdObj, centered);
                }
                var onAdd = _this.props.onAdd;
                if (onAdd && editable && !loaded) {
                    onAdd(createdObj);
                }
            },
            remove: function () {
                var activeObject = _this.canvas.getActiveObject();
                if (!activeObject) {
                    return false;
                }
                if (activeObject.type !== 'activeSelection') {
                    _this.canvas.discardActiveObject();
                    if (_this.handlers.isElementType(activeObject.type)) {
                        _this.elementHandlers.removeById(activeObject.id);
                        _this.elementHandlers.removeStyleById(activeObject.id);
                        _this.elementHandlers.removeScriptById(activeObject.id);
                    }
                    if (activeObject.superType === 'link') {
                        _this.linkHandlers.remove(activeObject);
                    }
                    else if (activeObject.superType === 'node') {
                        if (activeObject.toPort) {
                            if (activeObject.toPort.links.length) {
                                activeObject.toPort.links.forEach(function (link) {
                                    _this.linkHandlers.remove(link, 'from');
                                });
                            }
                            _this.canvas.remove(activeObject.toPort);
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
                    _this.canvas.remove(activeObject);
                    _this.handlers.removeOriginById(activeObject.id);
                }
                else {
                    var activeObjects = activeObject._objects;
                    _this.canvas.discardActiveObject();
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
                var onRemove = _this.props.onRemove;
                if (onRemove) {
                    onRemove(activeObject);
                }
            },
            removeById: function (id) {
                var findObject = _this.handlers.findById(id);
                if (findObject) {
                    _this.canvas.discardActiveObject();
                    var onRemove = _this.props.onRemove;
                    if (onRemove) {
                        onRemove(findObject);
                    }
                    if (_this.handlers.isElementType(findObject.type)) {
                        _this.elementHandlers.removeById(findObject.id);
                        _this.elementHandlers.removeStyleById(findObject.id);
                        _this.elementHandlers.removeScriptById(findObject.id);
                    }
                    _this.canvas.remove(findObject);
                    _this.handlers.removeOriginById(findObject.id);
                }
            },
            duplicate: function () {
                var _a = _this.props, onAdd = _a.onAdd, propertiesToInclude = _a.propertiesToInclude;
                var activeObject = _this.canvas.getActiveObject();
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
                            obj.set('id', v4_1.default());
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
                        clonedObj.set('id', v4_1.default());
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
            },
            duplicateById: function (id) {
                var _a = _this.props, onAdd = _a.onAdd, propertiesToInclude = _a.propertiesToInclude;
                var findObject = _this.handlers.findById(id);
                if (findObject) {
                    findObject.clone(function (cloned) {
                        cloned.set({
                            left: cloned.left + 10,
                            top: cloned.top + 10,
                            id: v4_1.default(),
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
            },
            copy: function () {
                var propertiesToInclude = _this.props.propertiesToInclude;
                var activeObject = _this.canvas.getActiveObject();
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
            },
            paste: function () {
                var _a = _this.props, onAdd = _a.onAdd, propertiesToInclude = _a.propertiesToInclude;
                var clipboard = _this.state.clipboard;
                if (!clipboard) {
                    return false;
                }
                clipboard.clone(function (clonedObj) {
                    _this.canvas.discardActiveObject();
                    clonedObj.set({
                        left: clonedObj.left + 10,
                        top: clonedObj.top + 10,
                        id: v4_1.default(),
                        evented: true,
                    });
                    if (clonedObj.type === 'activeSelection') {
                        clonedObj.canvas = _this.canvas;
                        clonedObj.forEachObject(function (obj) {
                            obj.set('id', v4_1.default());
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
                        clonedObj.set('id', v4_1.default());
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
            },
            set: function (key, value) {
                var activeObject = _this.canvas.getActiveObject();
                if (!activeObject) {
                    return false;
                }
                activeObject.set(key, value);
                activeObject.setCoords();
                _this.canvas.requestRenderAll();
                var onModified = _this.props.onModified;
                if (onModified) {
                    onModified(activeObject);
                }
            },
            setObject: function (option) {
                var activeObject = _this.canvas.getActiveObject();
                if (!activeObject) {
                    return false;
                }
                Object.keys(option).forEach(function (key) {
                    if (option[key] !== activeObject[key]) {
                        activeObject.set(key, option[key]);
                        activeObject.setCoords();
                    }
                });
                _this.canvas.requestRenderAll();
                var onModified = _this.props.onModified;
                if (onModified) {
                    onModified(activeObject);
                }
            },
            setByObject: function (obj, key, value) {
                if (!obj) {
                    return;
                }
                obj.set(key, value);
                obj.setCoords();
                _this.canvas.renderAll();
                var onModified = _this.props.onModified;
                if (onModified) {
                    onModified(obj);
                }
            },
            setById: function (id, key, value) {
                var findObject = _this.handlers.findById(id);
                _this.handlers.setByObject(findObject, key, value);
            },
            setShadow: function (key, value) {
                var activeObject = _this.canvas.getActiveObject();
                if (!activeObject) {
                    return false;
                }
                activeObject.setShadow(value);
                _this.canvas.requestRenderAll();
                var onModified = _this.props.onModified;
                if (onModified) {
                    onModified(activeObject);
                }
            },
            loadImage: function (obj, src) {
                fabric_1.fabric.util.loadImage(src, function (source) {
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
            },
            setImage: function (obj, src) {
                if (!src) {
                    _this.handlers.loadImage(obj, null);
                    obj.set('file', null);
                    obj.set('src', null);
                    return;
                }
                if (typeof src === 'string') {
                    _this.handlers.loadImage(obj, src);
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
            },
            setImageById: function (id, source) {
                var findObject = _this.handlers.findById(id);
                _this.handlers.setImage(findObject, source);
            },
            find: function (obj) { return _this.handlers.findById(obj.id); },
            findById: function (id) {
                var findObject;
                var exist = _this.canvas.getObjects().some(function (obj) {
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
            },
            allSelect: function () {
                var canvas = _this.canvas;
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
                var activeSelection = new fabric_1.fabric.ActiveSelection(filteredObjects, __assign({ canvas: canvas }, _this.props.activeSelection));
                canvas.setActiveObject(activeSelection);
                canvas.renderAll();
            },
            select: function (obj) {
                var findObject = _this.handlers.find(obj);
                if (findObject) {
                    _this.canvas.discardActiveObject();
                    _this.canvas.setActiveObject(findObject);
                    _this.canvas.requestRenderAll();
                }
            },
            selectById: function (id) {
                var findObject = _this.handlers.findById(id);
                if (findObject) {
                    _this.canvas.discardActiveObject();
                    _this.canvas.setActiveObject(findObject);
                    _this.canvas.requestRenderAll();
                }
            },
            originScaleToResize: function (obj, width, height) {
                if (obj.id === 'workarea') {
                    _this.handlers.setById(obj.id, 'workareaWidth', obj.width);
                    _this.handlers.setById(obj.id, 'workareaHeight', obj.height);
                }
                _this.handlers.setById(obj.id, 'scaleX', width / obj.width);
                _this.handlers.setById(obj.id, 'scaleY', height / obj.height);
            },
            scaleToResize: function (width, height) {
                var activeObject = _this.canvas.getActiveObject();
                var obj = {
                    id: activeObject.id,
                    scaleX: width / activeObject.width,
                    scaleY: height / activeObject.height,
                };
                _this.handlers.setObject(obj);
                activeObject.setCoords();
                _this.canvas.requestRenderAll();
            },
            importJSON: function (json, callback) {
                if (typeof json === 'string') {
                    json = JSON.parse(json);
                }
                var prevLeft = 0;
                var prevTop = 0;
                _this.canvas.setBackgroundColor(_this.props.canvasOption.backgroundColor);
                var workareaExist = json.filter(function (obj) { return obj.id === 'workarea'; });
                if (!_this.workarea) {
                    _this.workarea = new fabric_1.fabric.Image(null, __assign({}, defaultWorkareaOption, _this.props.workareaOption));
                    _this.canvas.add(_this.workarea);
                    _this.objects.push(_this.workarea);
                }
                if (!workareaExist.length) {
                    _this.canvas.centerObject(_this.workarea);
                    _this.workarea.setCoords();
                    prevLeft = _this.workarea.left;
                    prevTop = _this.workarea.top;
                }
                else {
                    var workarea = workareaExist[0];
                    prevLeft = workarea.left;
                    prevTop = workarea.top;
                    _this.workarea.set(workarea);
                    _this.canvas.centerObject(_this.workarea);
                    _this.workareaHandlers.setImage(workarea.src, true);
                    _this.workarea.setCoords();
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
                            obj.id = v4_1.default();
                        }
                        _this.handlers.add(obj, false, true);
                        _this.canvas.renderAll();
                    });
                    if (callback) {
                        callback(_this.canvas);
                    }
                }, 300);
                _this.canvas.setZoom(1);
            },
            exportJSON: function () { return _this.canvas.toDatalessJSON(_this.props.propertiesToInclude); },
            getObjects: function () { return _this.canvas.getObjects().filter(function (obj) {
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
            }); },
            bringForward: function () {
                var activeObject = _this.canvas.getActiveObject();
                if (activeObject) {
                    _this.canvas.bringForward(activeObject);
                    var onModified = _this.props.onModified;
                    if (onModified) {
                        onModified(activeObject);
                    }
                }
            },
            bringToFront: function () {
                var activeObject = _this.canvas.getActiveObject();
                if (activeObject) {
                    _this.canvas.bringToFront(activeObject);
                    var onModified = _this.props.onModified;
                    if (onModified) {
                        onModified(activeObject);
                    }
                }
            },
            sendBackwards: function () {
                var activeObject = _this.canvas.getActiveObject();
                if (activeObject) {
                    if (_this.canvas.getObjects()[1].id === activeObject.id) {
                        return;
                    }
                    _this.canvas.sendBackwards(activeObject);
                    var onModified = _this.props.onModified;
                    if (onModified) {
                        onModified(activeObject);
                    }
                }
            },
            sendToBack: function () {
                var activeObject = _this.canvas.getActiveObject();
                if (activeObject) {
                    _this.canvas.sendToBack(activeObject);
                    _this.canvas.sendToBack(_this.canvas.getObjects()[1]);
                    var onModified = _this.props.onModified;
                    if (onModified) {
                        onModified(activeObject);
                    }
                }
            },
            clear: function (workarea) {
                if (workarea === void 0) { workarea = false; }
                var canvas = _this.canvas;
                var ids = canvas.getObjects().reduce(function (prev, curr) {
                    if (_this.handlers.isElementType(curr.type)) {
                        prev.push(curr.id);
                        return prev;
                    }
                    return prev;
                }, []);
                _this.elementHandlers.removeByIds(ids);
                if (workarea) {
                    canvas.clear();
                    _this.workarea = null;
                }
                else {
                    canvas.getObjects().forEach(function (obj) {
                        if (obj.id !== 'workarea') {
                            canvas.remove(obj);
                        }
                    });
                }
            },
            toGroup: function () {
                var canvas = _this.canvas;
                if (!canvas.getActiveObject()) {
                    return;
                }
                if (canvas.getActiveObject().type !== 'activeSelection') {
                    return;
                }
                var group = canvas.getActiveObject().toGroup();
                group.set(__assign({ id: v4_1.default(), name: 'New group' }, _this.props.defaultOptions));
                var onSelect = _this.props.onSelect;
                if (onSelect) {
                    onSelect(group);
                }
                canvas.renderAll();
            },
            toActiveSelection: function () {
                var canvas = _this.canvas;
                if (!canvas.getActiveObject()) {
                    return;
                }
                if (canvas.getActiveObject().type !== 'group') {
                    return;
                }
                var activeObject = canvas.getActiveObject().toActiveSelection();
                var onSelect = _this.props.onSelect;
                if (onSelect) {
                    onSelect(activeObject);
                }
                canvas.renderAll();
            },
            isElementType: function (type) {
                return type === 'video' || type === 'element' || type === 'iframe';
            },
            getOriginObjects: function () { return _this.objects; },
            findOriginById: function (id) {
                var findObject;
                var exist = _this.objects.some(function (obj) {
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
            },
            findOriginByIdWithIndex: function (id) {
                var findObject;
                var index;
                var exist = _this.objects.some(function (obj, i) {
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
            },
            removeOriginById: function (id) {
                var object = _this.handlers.findOriginByIdWithIndex(id);
                if (object) {
                    _this.objects.splice(object.index, 1);
                }
            },
        };
        _this.cropHandlers = {
            validType: function () {
                var activeObject = _this.canvas.getActiveObject();
                if (!activeObject) {
                    return true;
                }
                if (activeObject.type === 'image') {
                    return false;
                }
                return true;
            },
            start: function () {
                if (_this.cropHandlers.validType()) {
                    return;
                }
                _this.interactionMode = 'crop';
                _this.cropObject = _this.canvas.getActiveObject();
                var _a = _this.cropObject, left = _a.left, top = _a.top;
                _this.cropRect = new fabric_1.fabric.Rect({
                    width: _this.cropObject.width,
                    height: _this.cropObject.height,
                    scaleX: _this.cropObject.scaleX,
                    scaleY: _this.cropObject.scaleY,
                    originX: 'left',
                    originY: 'top',
                    left: left,
                    top: top,
                    hasRotatingPoint: false,
                    fill: 'rgba(0, 0, 0, 0.2)',
                });
                _this.canvas.add(_this.cropRect);
                _this.canvas.setActiveObject(_this.cropRect);
                _this.cropObject.selectable = false;
                _this.cropObject.evented = false;
                _this.canvas.renderAll();
            },
            finish: function () {
                var _a = _this.cropRect, left = _a.left, top = _a.top, width = _a.width, height = _a.height, scaleX = _a.scaleX, scaleY = _a.scaleY;
                var croppedImg = _this.cropObject.toDataURL({
                    left: left - _this.cropObject.left,
                    top: top - _this.cropObject.top,
                    width: width * scaleX,
                    height: height * scaleY,
                });
                _this.handlers.setImage(_this.cropObject, croppedImg);
                _this.cropHandlers.cancel();
            },
            cancel: function () {
                _this.interactionMode = 'selection';
                _this.cropObject.selectable = true;
                _this.cropObject.evented = true;
                _this.canvas.setActiveObject(_this.cropObject);
                _this.canvas.remove(_this.cropRect);
                _this.cropRect = null;
                // this.cropObject = null;
                _this.canvas.renderAll();
            },
            resize: function (opt) {
                var target = opt.target, _a = opt.transform, original = _a.original, corner = _a.corner;
                var left = target.left, top = target.top, width = target.width, height = target.height, scaleX = target.scaleX, scaleY = target.scaleY;
                var _b = _this.cropObject, cropLeft = _b.left, cropTop = _b.top, cropWidth = _b.width, cropHeight = _b.height, cropScaleX = _b.scaleX, cropScaleY = _b.scaleY;
                if (corner === 'tl') {
                    if (Math.round(cropLeft) > Math.round(left)) { // left
                        var originRight = Math.round(cropLeft + cropWidth);
                        var targetRight = Math.round(target.getBoundingRect().left + target.getBoundingRect().width);
                        var diffRightRatio = 1 - ((originRight - targetRight) / cropWidth);
                        target.set({
                            left: cropLeft,
                            scaleX: diffRightRatio > 1 ? 1 : diffRightRatio,
                        });
                    }
                    if (Math.round(cropTop) > Math.round(top)) { // top
                        var originBottom = Math.round(cropTop + cropHeight);
                        var targetBottom = Math.round(target.getBoundingRect().top + target.getBoundingRect().height);
                        var diffBottomRatio = 1 - ((originBottom - targetBottom) / cropHeight);
                        target.set({
                            top: cropTop,
                            scaleY: diffBottomRatio > 1 ? 1 : diffBottomRatio,
                        });
                    }
                }
                else if (corner === 'bl') {
                    if (Math.round(cropLeft) > Math.round(left)) { // left
                        var originRight = Math.round(cropLeft + cropWidth);
                        var targetRight = Math.round(target.getBoundingRect().left + target.getBoundingRect().width);
                        var diffRightRatio = 1 - ((originRight - targetRight) / cropWidth);
                        target.set({
                            left: cropLeft,
                            scaleX: diffRightRatio > 1 ? 1 : diffRightRatio,
                        });
                    }
                    if (Math.round(cropTop + (cropHeight * cropScaleY) < Math.round(top + (height * scaleY)))) { // bottom
                        var diffTopRatio = 1 - ((original.top - cropTop) / cropHeight);
                        target.set({
                            top: original.top,
                            scaleY: diffTopRatio > 1 ? 1 : diffTopRatio,
                        });
                    }
                }
                else if (corner === 'tr') {
                    if (Math.round(cropLeft + (cropWidth * cropScaleX)) < Math.round(left + (width * scaleX))) { // right
                        var diffLeftRatio = 1 - ((original.left - cropLeft) / cropWidth);
                        target.set({
                            left: original.left,
                            scaleX: diffLeftRatio > 1 ? 1 : diffLeftRatio,
                        });
                    }
                    if (Math.round(cropTop) > Math.round(top)) { // top
                        var originBottom = Math.round(cropTop + cropHeight);
                        var targetBottom = Math.round(target.getBoundingRect().top + target.getBoundingRect().height);
                        var diffBottomRatio = 1 - ((originBottom - targetBottom) / cropHeight);
                        target.set({
                            top: cropTop,
                            scaleY: diffBottomRatio > 1 ? 1 : diffBottomRatio,
                        });
                    }
                }
                else if (corner === 'br') {
                    if (Math.round(cropLeft + (cropWidth * cropScaleX)) < Math.round(left + (width * scaleX))) { // right
                        var diffLeftRatio = 1 - ((original.left - cropLeft) / cropWidth);
                        target.set({
                            left: original.left,
                            scaleX: diffLeftRatio > 1 ? 1 : diffLeftRatio,
                        });
                    }
                    if (Math.round(cropTop + (cropHeight * cropScaleY) < Math.round(top + (height * scaleY)))) { // bottom
                        var diffTopRatio = 1 - ((original.top - cropTop) / cropHeight);
                        target.set({
                            top: original.top,
                            scaleY: diffTopRatio > 1 ? 1 : diffTopRatio,
                        });
                    }
                }
                else if (corner === 'ml') {
                    if (Math.round(cropLeft) > Math.round(left)) { // left
                        var originRight = Math.round(cropLeft + cropWidth);
                        var targetRight = Math.round(target.getBoundingRect().left + target.getBoundingRect().width);
                        var diffRightRatio = 1 - ((originRight - targetRight) / cropWidth);
                        target.set({
                            left: cropLeft,
                            scaleX: diffRightRatio > 1 ? 1 : diffRightRatio,
                        });
                    }
                }
                else if (corner === 'mt') {
                    if (Math.round(cropTop) > Math.round(top)) { // top
                        var originBottom = Math.round(cropTop + cropHeight);
                        var targetBottom = Math.round(target.getBoundingRect().top + target.getBoundingRect().height);
                        var diffBottomRatio = 1 - ((originBottom - targetBottom) / cropHeight);
                        target.set({
                            top: cropTop,
                            scaleY: diffBottomRatio > 1 ? 1 : diffBottomRatio,
                        });
                    }
                }
                else if (corner === 'mb') {
                    if (Math.round(cropTop + (cropHeight * cropScaleY) < Math.round(top + (height * scaleY)))) { // bottom
                        var diffTopRatio = 1 - ((original.top - cropTop) / cropHeight);
                        target.set({
                            top: original.top,
                            scaleY: diffTopRatio > 1 ? 1 : diffTopRatio,
                        });
                    }
                }
                else if (corner === 'mr') {
                    if (Math.round(cropLeft + (cropWidth * cropScaleX)) < Math.round(left + (width * scaleX))) { // right
                        var diffLeftRatio = 1 - ((original.left - cropLeft) / cropWidth);
                        target.set({
                            left: original.left,
                            scaleX: diffLeftRatio > 1 ? 1 : diffLeftRatio,
                        });
                    }
                }
            },
            moving: function (opt) {
                var target = opt.target;
                var left = target.left, top = target.top, width = target.width, height = target.height, scaleX = target.scaleX, scaleY = target.scaleY;
                var _a = _this.cropObject.getBoundingRect(), cropLeft = _a.left, cropTop = _a.top, cropWidth = _a.width, cropHeight = _a.height;
                var movedTop = function () {
                    if (Math.round(cropTop) >= Math.round(top)) {
                        target.set({
                            top: cropTop,
                        });
                    }
                    else if (Math.round(cropTop + cropHeight) <= Math.round(top + (height * scaleY))) {
                        target.set({
                            top: cropTop + cropHeight - (height * scaleY),
                        });
                    }
                };
                if (Math.round(cropLeft) >= Math.round(left)) {
                    target.set({
                        left: Math.max(left, cropLeft),
                    });
                    movedTop();
                }
                else if (Math.round(cropLeft + cropWidth) <= Math.round(left + (width * scaleX))) {
                    target.set({
                        left: cropLeft + cropWidth - (width * scaleX),
                    });
                    movedTop();
                }
                else if (Math.round(cropTop) >= Math.round(top)) {
                    target.set({
                        top: cropTop,
                    });
                }
                else if (Math.round(cropTop + cropHeight) <= Math.round(top + (height * scaleY))) {
                    target.set({
                        top: cropTop + cropHeight - (height * scaleY),
                    });
                }
            },
        };
        _this.modeHandlers = {
            selection: function (callback) {
                _this.interactionMode = 'selection';
                _this.canvas.selection = _this.props.canvasOption.selection;
                _this.canvas.defaultCursor = 'default';
                _this.workarea.hoverCursor = 'default';
                _this.canvas.getObjects().forEach(function (obj) {
                    if (obj.id !== 'workarea') {
                        if (obj.id === 'grid') {
                            obj.selectable = false;
                            obj.evented = false;
                            return;
                        }
                        if (callback) {
                            var ret = callback(obj);
                            if (typeof ret === 'object') {
                                obj.selectable = ret.selectable;
                                obj.evented = ret.evented;
                            }
                            else {
                                obj.selectable = ret;
                                obj.evented = ret;
                            }
                        }
                        else {
                            obj.selectable = true;
                            obj.evented = true;
                        }
                    }
                });
                _this.canvas.renderAll();
            },
            grab: function (callback) {
                _this.interactionMode = 'grab';
                _this.canvas.selection = false;
                _this.canvas.defaultCursor = 'grab';
                _this.workarea.hoverCursor = 'grab';
                _this.canvas.getObjects().forEach(function (obj) {
                    if (obj.id !== 'workarea') {
                        if (callback) {
                            var ret = callback(obj);
                            if (typeof ret === 'object') {
                                obj.selectable = ret.selectable;
                                obj.evented = ret.evented;
                            }
                            else {
                                obj.selectable = ret;
                                obj.evented = ret;
                            }
                        }
                        else {
                            obj.selectable = false;
                            obj.evented = _this.props.editable ? false : true;
                        }
                    }
                });
                _this.canvas.renderAll();
            },
            drawing: function (callback) {
                _this.interactionMode = 'polygon';
                _this.canvas.selection = false;
                _this.canvas.defaultCursor = 'pointer';
                _this.workarea.hoverCursor = 'pointer';
                _this.canvas.getObjects().forEach(function (obj) {
                    if (obj.id !== 'workarea') {
                        if (callback) {
                            var ret = callback(obj);
                            if (typeof ret === 'object') {
                                obj.selectable = ret.selectable;
                                obj.evented = ret.evented;
                            }
                            else {
                                obj.selectable = ret;
                                obj.evented = ret;
                            }
                        }
                        else {
                            obj.selectable = false;
                            obj.evented = _this.props.editable ? false : true;
                        }
                    }
                });
                _this.canvas.renderAll();
            },
            moving: function (e) {
                var delta = new fabric_1.fabric.Point(e.movementX, e.movementY);
                _this.canvas.relativePan(delta);
            },
        };
        _this.animationHandlers = {
            play: function (id, hasControls) {
                var findObject = _this.handlers.findById(id);
                if (!findObject) {
                    return;
                }
                if (findObject.anime) {
                    findObject.anime.restart();
                    return;
                }
                if (findObject.animation.type === 'none') {
                    return;
                }
                var instance = _this.animationHandlers.getAnimation(findObject, hasControls);
                if (instance) {
                    findObject.set('anime', instance);
                    findObject.set({
                        hasControls: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        hoverCursor: 'pointer',
                    });
                    _this.canvas.renderAll();
                    instance.play();
                }
            },
            pause: function (id) {
                var findObject = _this.handlers.findById(id);
                if (!findObject) {
                    return;
                }
                findObject.anime.pause();
            },
            stop: function (id, hasControls) {
                if (hasControls === void 0) { hasControls = true; }
                var findObject = _this.handlers.findById(id);
                if (!findObject) {
                    return;
                }
                _this.animationHandlers.initAnimation(findObject, hasControls);
            },
            restart: function (id) {
                var findObject = _this.handlers.findById(id);
                if (!findObject) {
                    return;
                }
                if (!findObject.anime) {
                    return;
                }
                _this.animationHandlers.stop(id);
                _this.animationHandlers.play(id);
            },
            initAnimation: function (obj, hasControls) {
                if (hasControls === void 0) { hasControls = true; }
                if (!obj.anime) {
                    return;
                }
                var option;
                if (_this.props.editable) {
                    option = {
                        anime: null,
                        hasControls: hasControls,
                        lockMovementX: !hasControls,
                        lockMovementY: !hasControls,
                        hoverCursor: hasControls ? 'move' : 'pointer',
                    };
                }
                else {
                    option = {
                        anime: null,
                        hasControls: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        hoverCursor: 'pointer',
                    };
                }
                animejs_1.default.remove(obj);
                var type = obj.animation.type;
                if (type === 'fade') {
                    Object.assign(option, {
                        opacity: obj.originOpacity,
                        originOpacity: null,
                    });
                }
                else if (type === 'bounce') {
                    if (obj.animation.bounce === 'vertical') {
                        Object.assign(option, {
                            top: obj.originTop,
                            originTop: null,
                        });
                    }
                    else {
                        Object.assign(option, {
                            left: obj.originLeft,
                            originLeft: null,
                        });
                    }
                }
                else if (type === 'shake') {
                    if (obj.animation.shake === 'vertical') {
                        Object.assign(option, {
                            top: obj.originTop,
                            originTop: null,
                        });
                    }
                    else {
                        Object.assign(option, {
                            left: obj.originLeft,
                            originLeft: null,
                        });
                    }
                }
                else if (type === 'scaling') {
                    Object.assign(option, {
                        scaleX: obj.originScaleX,
                        scaleY: obj.originScaleY,
                        originScaleX: null,
                        originScaleY: null,
                    });
                }
                else if (type === 'rotation') {
                    Object.assign(option, {
                        angle: obj.originAngle,
                        originAngle: null,
                    });
                }
                else if (type === 'flash') {
                    Object.assign(option, {
                        fill: obj.originFill,
                        stroke: obj.originStroke,
                        originFill: null,
                        origniStroke: null,
                    });
                }
                else {
                    console.warn('Not supported type.');
                }
                obj.set(option);
                _this.canvas.renderAll();
            },
            getAnimation: function (obj, hasControls) {
                var _a = obj.animation, _b = _a.delay, delay = _b === void 0 ? 100 : _b, _c = _a.duration, duration = _c === void 0 ? 100 : _c, _d = _a.autoplay, autoplay = _d === void 0 ? true : _d, _e = _a.loop, loop = _e === void 0 ? true : _e, type = _a.type, other = __rest(_a, ["delay", "duration", "autoplay", "loop", "type"]);
                var option = {
                    targets: obj,
                    delay: delay,
                    loop: loop,
                    autoplay: autoplay,
                    duration: duration,
                    direction: 'alternate',
                    begin: function () {
                        obj.set({
                            hasControls: false,
                            lockMovementX: true,
                            lockMovementY: true,
                            hoverCursor: 'pointer',
                        });
                        _this.canvas.renderAll();
                    },
                    update: function (e) {
                        if (type === 'flash') {
                            // I do not know why it works. Magic code...
                            var fill = e.animations[0].currentValue;
                            var stroke = e.animations[1].currentValue;
                            obj.set('fill', '');
                            obj.set('fill', fill);
                            obj.set('stroke', stroke);
                        }
                        obj.setCoords();
                        _this.canvas.renderAll();
                    },
                    complete: function () {
                        _this.animationHandlers.initAnimation(obj, hasControls);
                    },
                };
                if (type === 'fade') {
                    var _f = other.opacity, opacity = _f === void 0 ? 0 : _f;
                    obj.set('originOpacity', obj.opacity);
                    Object.assign(option, {
                        opacity: opacity,
                        easing: 'easeInQuad',
                    });
                }
                else if (type === 'bounce') {
                    var _g = other.offset, offset = _g === void 0 ? 1 : _g;
                    if (other.bounce === 'vertical') {
                        obj.set('originTop', obj.top);
                        Object.assign(option, {
                            top: obj.top + offset,
                            easing: 'easeInQuad',
                        });
                    }
                    else {
                        obj.set('originLeft', obj.left);
                        Object.assign(option, {
                            left: obj.left + offset,
                            easing: 'easeInQuad',
                        });
                    }
                }
                else if (type === 'shake') {
                    var _h = other.offset, offset = _h === void 0 ? 1 : _h;
                    if (other.shake === 'vertical') {
                        obj.set('originTop', obj.top);
                        Object.assign(option, {
                            top: obj.top + offset,
                            delay: 0,
                            elasticity: 1000,
                            duration: 500,
                        });
                    }
                    else {
                        obj.set('originLeft', obj.left);
                        Object.assign(option, {
                            left: obj.left + offset,
                            delay: 0,
                            elasticity: 1000,
                            duration: 500,
                        });
                    }
                }
                else if (type === 'scaling') {
                    var _j = other.scale, scale = _j === void 0 ? 1 : _j;
                    obj.set('originScaleX', obj.scaleX);
                    obj.set('originScaleY', obj.scaleY);
                    var scaleX = obj.scaleX * scale;
                    var scaleY = obj.scaleY * scale;
                    Object.assign(option, {
                        scaleX: scaleX,
                        scaleY: scaleY,
                        easing: 'easeInQuad',
                    });
                }
                else if (type === 'rotation') {
                    obj.set('originAngle', obj.angle);
                    Object.assign(option, {
                        angle: other.angle,
                        easing: 'easeInQuad',
                    });
                }
                else if (type === 'flash') {
                    var _k = other.fill, fill = _k === void 0 ? obj.fill : _k, _l = other.stroke, stroke = _l === void 0 ? obj.stroke : _l;
                    obj.set('originFill', obj.fill);
                    obj.set('originStroke', obj.stroke);
                    Object.assign(option, {
                        fill: fill,
                        stroke: stroke,
                        easing: 'easeInQuad',
                    });
                }
                else {
                    console.warn('Not supported type.');
                    return;
                }
                return animejs_1.default(option);
            },
        };
        _this.videoHandlers = {
            play: function () {
            },
            pause: function () {
            },
            stop: function () {
            },
            create: function (obj, src) {
                var editable = _this.props.editable;
                var id = obj.id, autoplay = obj.autoplay, muted = obj.muted, loop = obj.loop;
                var _a = obj.getBoundingRect(), left = _a.left, top = _a.top;
                var videoElement = fabric_1.fabric.util.makeElement('video', {
                    id: id,
                    autoplay: autoplay,
                    muted: muted,
                    loop: loop,
                    preload: 'none',
                    controls: false,
                });
                var scaleX = obj.scaleX, scaleY = obj.scaleY, angle = obj.angle;
                var zoom = _this.canvas.getZoom();
                var width = obj.width * scaleX * zoom;
                var height = obj.height * scaleY * zoom;
                var video = fabric_1.fabric.util.wrapElement(videoElement, 'div', {
                    id: obj.id + "_container",
                    style: "transform: rotate(" + angle + "deg);\n                        width: " + width + "px;\n                        height: " + height + "px;\n                        left: " + left + "px;\n                        top: " + top + "px;\n                        position: absolute;",
                });
                _this.container.current.appendChild(video);
                var player = new MediaElementPlayer(obj.id, {
                    pauseOtherPlayers: false,
                    videoWidth: '100%',
                    videoHeight: '100%',
                    success: function (mediaeElement, originalNode, instance) {
                        if (editable) {
                            instance.pause();
                        }
                        // https://www.youtube.com/watch?v=bbAQtfoQMp8
                        // console.log(mediaeElement, originalNode, instance);
                    },
                });
                player.setPlayerSize(width, height);
                player.setSrc(src.src);
                if (editable) {
                    _this.elementHandlers.draggable(video, obj);
                    video.addEventListener('mousedown', function (e) {
                        _this.canvas.setActiveObject(obj);
                        _this.canvas.renderAll();
                    }, false);
                }
                obj.setCoords();
                obj.set('player', player);
            },
            load: function (obj, src) {
                var canvas = _this.canvas;
                var editable = _this.props.editable;
                if (editable) {
                    _this.elementHandlers.removeById(obj.id);
                }
                _this.videoHandlers.create(obj, src);
                _this.canvas.renderAll();
                fabric_1.fabric.util.requestAnimFrame(function render() {
                    canvas.renderAll();
                    fabric_1.fabric.util.requestAnimFrame(render);
                });
            },
            set: function (obj, src) {
                var newSrc;
                if (typeof src === 'string') {
                    obj.set('file', null);
                    obj.set('src', src);
                    newSrc = {
                        src: src,
                    };
                    _this.videoHandlers.load(obj, newSrc);
                }
                else {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        obj.set('file', src);
                        obj.set('src', e.target.result);
                        newSrc = {
                            src: e.target.result,
                            type: src.type,
                        };
                        _this.videoHandlers.load(obj, newSrc);
                    };
                    reader.readAsDataURL(src);
                }
            },
        };
        _this.elementHandlers = {
            setById: function (id, source) {
                var findObject = _this.handlers.findById(id);
                if (!findObject) {
                    return;
                }
                if (findObject.type === 'video') {
                    _this.videoHandlers.set(findObject, source);
                }
                else if (findObject.type === 'element') {
                    _this.elementHandlers.set(findObject, source);
                }
                else if (findObject.type === 'iframe') {
                    _this.elementHandlers.set(findObject, source);
                }
            },
            set: function (obj, source) {
                if (obj.type === 'iframe') {
                    _this.elementHandlers.createIFrame(obj, source);
                }
                else {
                    _this.elementHandlers.createElement(obj, source);
                }
            },
            createElement: function (obj, code) {
                obj.set('code', code);
                var editable = _this.props.editable;
                var _a = obj.getBoundingRect(), left = _a.left, top = _a.top;
                var id = obj.id, scaleX = obj.scaleX, scaleY = obj.scaleY, angle = obj.angle;
                if (editable) {
                    _this.elementHandlers.removeById(id);
                    _this.elementHandlers.removeStyleById(id);
                    _this.elementHandlers.removeScriptById(id);
                }
                var zoom = _this.canvas.getZoom();
                var width = obj.width * scaleX * zoom;
                var height = obj.height * scaleY * zoom;
                var element = fabric_1.fabric.util.makeElement('div', {
                    id: id + "_container",
                    style: "transform: rotate(" + angle + "deg);\n                        width: " + width + "px;\n                        height: " + height + "px;\n                        left: " + left + "px;\n                        top: " + top + "px;\n                        position: absolute;",
                });
                var html = code.html, css = code.css, js = code.js;
                if (code.css && code.css.length) {
                    var styleElement = document.createElement('style');
                    styleElement.id = id + "_style";
                    styleElement.type = 'text/css';
                    styleElement.innerHTML = css;
                    document.head.appendChild(styleElement);
                }
                _this.container.current.appendChild(element);
                if (code.js && code.js.length) {
                    var script = document.createElement('script');
                    script.id = id + "_script";
                    script.type = 'text/javascript';
                    script.innerHTML = js;
                    element.appendChild(script);
                }
                element.innerHTML = html;
                if (editable) {
                    _this.elementHandlers.draggable(element, obj);
                    element.addEventListener('mousedown', function (e) {
                        _this.canvas.setActiveObject(obj);
                        _this.canvas.renderAll();
                    }, false);
                }
                obj.setCoords();
            },
            createIFrame: function (obj, src) {
                obj.set('src', src);
                var editable = _this.props.editable;
                var id = obj.id, scaleX = obj.scaleX, scaleY = obj.scaleY, angle = obj.angle;
                if (editable) {
                    _this.elementHandlers.removeById(id);
                }
                var _a = obj.getBoundingRect(), left = _a.left, top = _a.top;
                var iframeElement = fabric_1.fabric.util.makeElement('iframe', {
                    id: id,
                    src: src,
                    width: '100%',
                    height: '100%',
                });
                var zoom = _this.canvas.getZoom();
                var width = obj.width * scaleX * zoom;
                var height = obj.height * scaleY * zoom;
                var iframe = fabric_1.fabric.util.wrapElement(iframeElement, 'div', {
                    id: id + "_container",
                    style: "transform: rotate(" + angle + "deg);\n                        width: " + width + "px;\n                        height: " + height + "px;\n                        left: " + left + "px;\n                        top: " + top + "px;\n                        position: absolute;\n                        z-index: 100000;",
                });
                _this.container.current.appendChild(iframe);
                if (editable) {
                    _this.elementHandlers.draggable(iframe, obj);
                    iframe.addEventListener('mousedown', function (e) {
                        _this.canvas.setActiveObject(obj);
                        _this.canvas.renderAll();
                    }, false);
                }
                obj.setCoords();
            },
            findScriptById: function (id) { return document.getElementById(id + "_script"); },
            findStyleById: function (id) { return document.getElementById(id + "_style"); },
            findById: function (id) { return document.getElementById(id + "_container"); },
            remove: function (el) {
                if (!el) {
                    return;
                }
                _this.container.current.removeChild(el);
            },
            removeStyleById: function (id) {
                var style = _this.elementHandlers.findStyleById(id);
                if (!style) {
                    return;
                }
                document.head.removeChild(style);
            },
            removeScriptById: function (id) {
                var style = _this.elementHandlers.findScriptById(id);
                if (!style) {
                    return;
                }
                document.head.removeChild(style);
            },
            removeById: function (id) {
                var el = _this.elementHandlers.findById(id);
                _this.elementHandlers.remove(el);
            },
            removeByIds: function (ids) {
                ids.forEach(function (id) {
                    _this.elementHandlers.removeById(id);
                    _this.elementHandlers.removeStyleById(id);
                    _this.elementHandlers.removeScriptById(id);
                });
            },
            setPosition: function (el, left, top) {
                if (!el) {
                    return false;
                }
                el.style.left = left + "px";
                el.style.top = top + "px";
                el.style.transform = null;
                el.setAttribute('data-x', 0);
                el.setAttribute('data-y', 0);
                return el;
            },
            setSize: function (el, width, height) {
                if (!el) {
                    return false;
                }
                el.style.width = width + "px";
                el.style.height = height + "px";
                return el;
            },
            setScale: function (el, x, y) {
                if (!el) {
                    return false;
                }
                el.style.transform = "scale(" + x + ", " + y + ")";
                return el;
            },
            setZoom: function (el, zoom) {
                if (!el) {
                    return false;
                }
                el.style.zoom = zoom;
                return el;
            },
            draggable: function (el, obj) {
                if (!el) {
                    return false;
                }
                return interactjs_1.default(el)
                    .draggable({
                    restrict: {
                        restriction: 'parent',
                    },
                    onmove: function (e) {
                        var dx = e.dx, dy = e.dy, target = e.target;
                        // keep the dragged position in the data-x/data-y attributes
                        var x = (parseFloat(target.getAttribute('data-x')) || 0) + dx;
                        var y = (parseFloat(target.getAttribute('data-y')) || 0) + dy;
                        // translate the element
                        target.style.webkitTransform = "translate(" + x + "px, " + y + "px)";
                        target.style.transform = "translate(" + x + "px, " + y + "px)";
                        // update the posiion attributes
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                        // update canvas object the position
                        obj.set({
                            left: obj.left + dx,
                            top: obj.top + dy,
                        });
                        obj.setCoords();
                        _this.canvas.renderAll();
                    },
                    onend: function () {
                        if (_this.props.onSelect) {
                            _this.props.onSelect(obj);
                        }
                    },
                });
            },
        };
        _this.workareaHandlers = {
            setLayout: function (value) {
                _this.workarea.set('layout', value);
                var canvas = _this.canvas;
                var _element = _this.workarea._element;
                var scaleX = 1;
                var scaleY = 1;
                var isFixed = value === 'fixed';
                var isResponsive = value === 'responsive';
                var isFullscreen = value === 'fullscreen';
                if (_element) {
                    if (isFixed) {
                        scaleX = _this.workarea.workareaWidth / _element.width;
                        scaleY = _this.workarea.workareaHeight / _element.height;
                    }
                    else if (isResponsive) {
                        scaleX = canvas.getWidth() / _element.width;
                        scaleY = canvas.getHeight() / _element.height;
                        if (_element.height > _element.width) {
                            scaleX = scaleY;
                        }
                        else {
                            scaleY = scaleX;
                        }
                    }
                    else {
                        scaleX = canvas.getWidth() / _element.width;
                        scaleY = canvas.getHeight() / _element.height;
                    }
                }
                canvas.getObjects().forEach(function (obj) {
                    if (obj.id !== 'workarea') {
                        var objScaleX = !isFullscreen ? 1 : scaleX;
                        var objScaleY = !isFullscreen ? 1 : scaleY;
                        var objWidth = obj.width * objScaleX * canvas.getZoom();
                        var objHeight = obj.height * objScaleY * canvas.getZoom();
                        var el = _this.elementHandlers.findById(obj.id);
                        _this.elementHandlers.setSize(el, objWidth, objHeight);
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
                        var center_1 = canvas.getCenter();
                        var point_1 = {
                            x: center_1.left,
                            y: center_1.top,
                        };
                        _this.workarea.set({
                            scaleX: 1,
                            scaleY: 1,
                        });
                        _this.zoomHandlers.zoomToPoint(point_1, scaleX);
                    }
                    else {
                        _this.workarea.set({
                            width: 0,
                            height: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                        });
                    }
                    canvas.centerObject(_this.workarea);
                    canvas.renderAll();
                    return;
                }
                if (_element) {
                    _this.workarea.set({
                        width: _element.width,
                        height: _element.height,
                        scaleX: scaleX,
                        scaleY: scaleY,
                    });
                }
                else {
                    var width = isFixed ? _this.workarea.workareaWidth : _this.canvas.getWidth();
                    var height = isFixed ? _this.workarea.workareaHeight : _this.canvas.getHeight();
                    _this.workarea.set({
                        width: width,
                        height: height,
                    });
                    if (isFixed) {
                        canvas.centerObject(_this.workarea);
                    }
                    else {
                        _this.workarea.set({
                            left: 0,
                            top: 0,
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                        });
                    }
                }
                canvas.centerObject(_this.workarea);
                var center = canvas.getCenter();
                var point = {
                    x: center.left,
                    y: center.top,
                };
                canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                _this.zoomHandlers.zoomToPoint(point, 1);
                canvas.renderAll();
            },
            setResponsiveImage: function (src, loaded) {
                var _a = _this, canvas = _a.canvas, workarea = _a.workarea, zoomHandlers = _a.zoomHandlers;
                var editable = _this.props.editable;
                var imageFromUrl = function (source) {
                    fabric_1.fabric.Image.fromURL(source, function (img) {
                        var scaleX = canvas.getWidth() / img.width;
                        var scaleY = canvas.getHeight() / img.height;
                        if (img.height > img.width) {
                            scaleX = scaleY;
                            if (canvas.getWidth() < img.width * scaleX) {
                                scaleX = scaleX * (canvas.getWidth() / (img.width * scaleX));
                            }
                        }
                        else {
                            scaleY = scaleX;
                            if (canvas.getHeight() < img.height * scaleX) {
                                scaleX = scaleX * (canvas.getHeight() / (img.height * scaleX));
                            }
                        }
                        img.set({
                            originX: 'left',
                            originY: 'top',
                        });
                        workarea.set(__assign({}, img, { selectable: false }));
                        if (!source) {
                            scaleX = 1;
                        }
                        canvas.centerObject(workarea);
                        if (editable && !loaded) {
                            canvas.getObjects().forEach(function (obj, index) {
                                if (index !== 0) {
                                    var objWidth = obj.width * scaleX;
                                    var objHeight = obj.height * scaleY;
                                    var el = _this.elementHandlers.findById(obj.id);
                                    _this.elementHandlers.setSize(el, objWidth, objHeight);
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
                        var center = canvas.getCenter();
                        var point = {
                            x: center.left,
                            y: center.top,
                        };
                        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                        zoomHandlers.zoomToPoint(point, scaleX);
                        canvas.renderAll();
                    });
                };
                if (!src) {
                    workarea.set({
                        src: src,
                    });
                    imageFromUrl(src);
                    return;
                }
                if (typeof src === 'string') {
                    workarea.set({
                        src: src,
                    });
                    imageFromUrl(src);
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    workarea.set({
                        file: src,
                    });
                    imageFromUrl(e.target.result);
                };
                reader.readAsDataURL(src);
            },
            setImage: function (src, loaded) {
                if (loaded === void 0) { loaded = false; }
                var _a = _this, canvas = _a.canvas, workarea = _a.workarea, zoomHandlers = _a.zoomHandlers, workareaHandlers = _a.workareaHandlers;
                var editable = _this.props.editable;
                if (workarea.layout === 'responsive') {
                    workareaHandlers.setResponsiveImage(src, loaded);
                    return;
                }
                var imageFromUrl = function (source) {
                    fabric_1.fabric.Image.fromURL(source, function (img) {
                        var width = canvas.getWidth();
                        var height = canvas.getHeight();
                        if (workarea.layout === 'fixed') {
                            width = workarea.width * workarea.scaleX;
                            height = workarea.height * workarea.scaleY;
                        }
                        var scaleX = 1;
                        var scaleY = 1;
                        if (source) {
                            scaleX = width / img.width;
                            scaleY = height / img.height;
                            img.set({
                                originX: 'left',
                                originY: 'top',
                                scaleX: scaleX,
                                scaleY: scaleY,
                            });
                            workarea.set(__assign({}, img, { selectable: false }));
                        }
                        else {
                            workarea.set({
                                _element: null,
                                selectable: false,
                            });
                        }
                        canvas.centerObject(workarea);
                        if (editable && !loaded) {
                            var layout_1 = workarea.layout;
                            canvas.getObjects().forEach(function (obj, index) {
                                if (index !== 0) {
                                    scaleX = layout_1 !== 'fullscreen' ? 1 : scaleX;
                                    scaleY = layout_1 !== 'fullscreen' ? 1 : scaleY;
                                    var objWidth = obj.width * scaleX;
                                    var objHeight = obj.height * scaleY;
                                    var el = _this.elementHandlers.findById(obj.id);
                                    _this.elementHandlers.setSize(el, width, height);
                                    if (obj.player) {
                                        obj.player.setPlayerSize(objWidth, objHeight);
                                    }
                                    obj.set({
                                        scaleX: scaleX,
                                        scaleY: scaleY,
                                    });
                                    obj.setCoords();
                                }
                            });
                        }
                        var center = canvas.getCenter();
                        var point = {
                            x: center.left,
                            y: center.top,
                        };
                        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                        zoomHandlers.zoomToPoint(point, 1);
                        canvas.renderAll();
                    });
                };
                if (!src) {
                    workarea.set({
                        src: src,
                    });
                    imageFromUrl(src);
                    return;
                }
                if (typeof src === 'string') {
                    workarea.set({
                        src: src,
                    });
                    imageFromUrl(src);
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    workarea.set({
                        file: src,
                    });
                    imageFromUrl(e.target.result);
                };
                reader.readAsDataURL(src);
            },
        };
        _this.nodeHandlers = {
            selectByPath: function (path) {
                if (!path || !path.length) {
                    return;
                }
                var splitPath = path.reduce(function (prev, curr, index) {
                    if (!path[index + 1]) {
                        return prev;
                    }
                    var newPath = [path[index], path[index + 1]];
                    prev.push(newPath);
                    return prev;
                }, []);
                var targetObjects = _this.handlers.getOriginObjects().filter(function (object) { return path.some(function (id) { return id === object.id; }); });
                var nonTargetObjects = _this.handlers.getOriginObjects().filter(function (object) { return path.some(function (id) { return id !== object.id; }); });
                nonTargetObjects.forEach(function (object) {
                    if (object.superType === 'link') {
                        var fromNode_1 = object.fromNode, toNode_1 = object.toNode;
                        if (splitPath.some(function (findPath) { return fromNode_1.id === findPath[0] && toNode_1.id === findPath[1]; })) {
                            object.set({
                                opacity: 1,
                            });
                            object.setShadow({
                                color: object.stroke,
                            });
                            _this.nodeHandlers.highlightingNode(object, 300);
                            _this.canvas.renderAll();
                            return;
                        }
                    }
                    object.set({
                        opacity: 0.2,
                    });
                    if (object.superType === 'node') {
                        if (object.toPort) {
                            object.toPort.set({
                                opacity: 0.2,
                            });
                        }
                        object.fromPort.forEach(function (port) {
                            port.set({
                                opacity: 0.2,
                            });
                        });
                    }
                    if (!object.isAnimated) {
                        object.setShadow({
                            blur: 0,
                        });
                    }
                });
                targetObjects.forEach(function (object) {
                    object.set({
                        opacity: 1,
                    });
                    object.setShadow({
                        color: object.fill,
                    });
                    _this.nodeHandlers.highlightingNode(object, 300);
                    if (object.toPort) {
                        object.toPort.set({
                            opacity: 1,
                        });
                    }
                    if (object.fromPort) {
                        object.fromPort.forEach(function (port) {
                            port.set({
                                opacity: 1,
                            });
                        });
                    }
                });
                _this.canvas.renderAll();
            },
            selectById: function (id) {
                _this.handlers.getOriginObjects().forEach(function (object) {
                    if (id === object.id) {
                        object.setShadow({
                            color: object.fill,
                            blur: 50,
                        });
                        return;
                    }
                    else if (id === object.nodeId) {
                        return;
                    }
                    object.setShadow({
                        blur: 0,
                    });
                });
                _this.canvas.renderAll();
            },
            deselect: function () {
                _this.handlers.getOriginObjects().forEach(function (object) {
                    object.set({
                        opacity: 1,
                    });
                    if (object.superType === 'node') {
                        if (object.toPort) {
                            object.toPort.set({
                                opacity: 1,
                            });
                        }
                        object.fromPort.forEach(function (port) {
                            port.set({
                                opacity: 1,
                            });
                        });
                    }
                    if (!object.isAnimated) {
                        object.setShadow({
                            blur: 0,
                        });
                    }
                });
                _this.canvas.renderAll();
            },
            highlightingByPath: function (path) {
                if (!path || !path.length) {
                    return;
                }
                var splitPath = path.reduce(function (prev, curr, index) {
                    if (!path[index + 1]) {
                        return prev;
                    }
                    var newPath = [path[index], path[index + 1]];
                    prev.push(newPath);
                    return prev;
                }, []);
                var targetObjects = _this.handlers.getOriginObjects().filter(function (object) { return path.some(function (id) { return id === object.id; }); });
                var nonTargetObjects = _this.handlers.getOriginObjects().filter(function (object) { return path.some(function (id) { return id !== object.id; }); });
                var lastObject = targetObjects.filter(function (obj) { return obj.id === path[path.length - 1]; })[0];
                targetObjects.forEach(function (object) {
                    if (lastObject) {
                        object.setShadow({
                            color: lastObject.fill,
                        });
                    }
                    else {
                        object.setShadow({
                            color: object.fill,
                        });
                    }
                    _this.nodeHandlers.highlightingNode(object);
                });
                nonTargetObjects.forEach(function (object) {
                    if (object.superType === 'link') {
                        var fromNode_2 = object.fromNode, toNode_2 = object.toNode;
                        if (splitPath.some(function (findPath) { return fromNode_2.id === findPath[0] && toNode_2.id === findPath[1]; })) {
                            if (lastObject) {
                                object.setShadow({
                                    color: lastObject.stroke,
                                });
                            }
                            else {
                                object.setShadow({
                                    color: object.stroke,
                                });
                            }
                            _this.nodeHandlers.highlightingNode(object);
                            _this.nodeHandlers.highlightingLink(object, lastObject);
                        }
                    }
                });
                _this.canvas.renderAll();
            },
            highlightingLink: function (object, targetObject, duration) {
                if (duration === void 0) { duration = 500; }
                object.animation = {
                    duration: duration,
                    type: 'flash',
                    stroke: targetObject ? targetObject.stroke : object.stroke,
                    loop: 1,
                    delay: 0,
                };
                _this.animationHandlers.play(object.id, false);
            },
            highlightingNode: function (object, duration) {
                if (duration === void 0) { duration = 500; }
                var maxBlur = 50;
                var minBlur = 0;
                var onComplete = function () {
                    if (object.shadow.blur === maxBlur) {
                        object.isAnimated = true;
                        object.animate('shadow.blur', minBlur, {
                            easing: fabric_1.fabric.util.ease.easeInOutQuad,
                            onChange: function (value) {
                                object.shadow.blur = value;
                                _this.canvas.renderAll();
                            },
                            onComplete: function () {
                                object.isAnimated = false;
                                if (object.superType === 'link') {
                                    object.set({
                                        stroke: object.originStroke,
                                    });
                                }
                            },
                        });
                    }
                };
                object.isAnimated = true;
                object.animate('shadow.blur', maxBlur, {
                    easing: fabric_1.fabric.util.ease.easeInOutQuad,
                    duration: duration,
                    onChange: function (value) {
                        object.shadow.blur = value;
                        _this.canvas.renderAll();
                    },
                    onComplete: onComplete,
                });
            },
        };
        _this.portHandlers = {
            createPort: function (target) {
                if (!target.createToPort) {
                    return;
                }
                var toPort = target.createToPort(target.left + (target.width / 2), target.top);
                if (toPort) {
                    toPort.on('mouseover', function () {
                        if (_this.interactionMode === 'link' && _this.activeLine && _this.activeLine.class === 'line') {
                            if (toPort.links.some(function (link) { return link.fromNode.id === _this.activeLine.fromNode; })) {
                                toPort.set({
                                    fill: toPort.errorFill,
                                });
                                _this.canvas.renderAll();
                                return;
                            }
                            toPort.set({
                                fill: toPort.hoverFill,
                            });
                            _this.canvas.renderAll();
                        }
                    });
                    toPort.on('mouseout', function () {
                        toPort.set({
                            fill: toPort.originFill,
                        });
                        _this.canvas.renderAll();
                    });
                    _this.canvas.add(toPort);
                    toPort.setCoords();
                    _this.canvas.bringToFront(toPort);
                }
                var fromPort = target.createFromPort(target.left + (target.width / 2), target.top + target.height);
                if (fromPort && fromPort.length) {
                    fromPort.forEach(function (port) {
                        if (port) {
                            port.on('mouseover', function () {
                                if (port.enabled) {
                                    if (_this.activeLine) {
                                        port.set({
                                            fill: port.errorFill,
                                        });
                                        _this.canvas.renderAll();
                                        return;
                                    }
                                    port.set({
                                        fill: port.hoverFill,
                                    });
                                    _this.canvas.renderAll();
                                    return;
                                }
                                port.set({
                                    fill: port.errorFill,
                                });
                                _this.canvas.renderAll();
                            });
                            port.on('mouseout', function () {
                                port.set({
                                    fill: port.originFill,
                                });
                                _this.canvas.renderAll();
                            });
                            _this.canvas.add(port);
                            port.setCoords();
                            _this.canvas.bringToFront(port);
                        }
                    });
                }
            },
            setCoords: function (target) {
                if (target.toPort) {
                    var toCoords_1 = {
                        left: target.left + (target.width / 2),
                        top: target.top,
                    };
                    target.toPort.set(__assign({}, toCoords_1));
                    target.toPort.setCoords();
                    if (target.toPort.links.length) {
                        target.toPort.links.forEach(function (link) {
                            var fromPort = link.fromNode.fromPort.filter(function (port) { return port.id === link.fromPort; })[0];
                            _this.linkHandlers.setCoords(fromPort.left, fromPort.top, toCoords_1.left, toCoords_1.top, link);
                        });
                    }
                }
                if (target.fromPort) {
                    var fromCoords_1 = {
                        left: target.left + (target.width / 2),
                        top: target.top + target.height,
                    };
                    target.fromPort.forEach(function (port) {
                        var left = port.leftDiff ? fromCoords_1.left + port.leftDiff : fromCoords_1.left;
                        var top = port.topDiff ? fromCoords_1.top + port.topDiff : fromCoords_1.top;
                        port.set({
                            left: left,
                            top: top,
                        });
                        port.setCoords();
                        if (port.links.length) {
                            port.links.forEach(function (link) {
                                _this.linkHandlers.setCoords(left, top, link.toNode.toPort.left, link.toNode.toPort.top, link);
                            });
                        }
                    });
                }
            },
            recreatePort: function (target) {
                var fromPort = target.fromPort, toPort = target.toPort;
                if (target.ports) {
                    target.ports.forEach(function (port) {
                        target.removeWithUpdate(port);
                        _this.canvas.remove(port.fromPort);
                    });
                }
                _this.canvas.remove(target.toPort);
                if (target.toPort) {
                    target.toPort.links.forEach(function (link) {
                        _this.linkHandlers.remove(link, 'from');
                    });
                }
                if (target.fromPort) {
                    target.fromPort.forEach(function (port) {
                        if (port.links.length) {
                            port.links.forEach(function (link) {
                                _this.linkHandlers.remove(link, 'to');
                            });
                        }
                    });
                }
                _this.portHandlers.createPort(target);
                toPort.links.forEach(function (link) {
                    link.fromNode = link.fromNode.id;
                    link.toNode = target.toPort.nodeId;
                    _this.linkHandlers.create(link);
                });
                fromPort.filter(function (op) { return target.fromPort.some(function (np) { return np.id === op.id; }); }).forEach(function (port) {
                    port.links.forEach(function (link) {
                        if (link.fromPort === port.id) {
                            link.fromNode = port.nodeId;
                            link.toNode = link.toNode.id;
                            _this.linkHandlers.create(link);
                            _this.portHandlers.setCoords(target);
                        }
                    });
                });
            },
        };
        _this.linkHandlers = {
            init: function (target) {
                if (!target.enabled) {
                    console.warn('이미 연결된 노드가 존재 합니다.');
                    return;
                }
                _this.interactionMode = 'link';
                var left = target.left, top = target.top;
                // const points = [left, top, left, top];
                var fromPort = { left: left, top: top };
                var toPort = { left: left, top: top };
                _this.activeLine = new CurvedLink_1.default(target.nodeId, fromPort, null, toPort, {
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
                    fromNode: target.nodeId,
                    fromPort: target.id,
                });
                _this.canvas.add(_this.activeLine);
            },
            finish: function () {
                _this.interactionMode = 'selection';
                _this.canvas.remove(_this.activeLine);
                _this.activeLine = null;
                _this.canvas.renderAll();
            },
            generate: function (target) {
                if (target.nodeId === _this.activeLine.fromNode) {
                    console.warn('같은 노드를 선택할 수 없습니다.');
                    return;
                }
                var link = {
                    type: 'CurvedLink',
                    fromNode: _this.activeLine.fromNode,
                    fromPort: _this.activeLine.fromPort,
                    toNode: target.nodeId,
                    toPort: target.id,
                };
                _this.linkHandlers.create(link, true);
                _this.linkHandlers.finish();
            },
            create: function (link, init) {
                if (init === void 0) { init = false; }
                var fromNode = _this.handlers.findById(link.fromNode);
                var fromPort = fromNode.fromPort.filter(function (port) { return port.id === link.fromPort || !port.id; })[0];
                var toNode = _this.handlers.findById(link.toNode);
                var toPort = toNode.toPort;
                var createdObj = _this.fabricObjects[link.type].create(fromNode, fromPort, toNode, toPort, __assign({}, link));
                _this.canvas.add(createdObj);
                _this.objects.push(createdObj);
                var onAdd = _this.props.onAdd;
                if (onAdd && _this.props.editable && init) {
                    onAdd(createdObj);
                }
                _this.canvas.renderAll();
                createdObj.setPort(fromNode, fromPort, toNode, toPort);
                _this.portHandlers.setCoords(fromNode);
                _this.portHandlers.setCoords(toNode);
                return createdObj;
            },
            setCoords: function (x1, y1, x2, y2, link) {
                link.set({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                });
                link.setCoords();
            },
            removeFrom: function (link) {
                if (link.fromNode.fromPort.length) {
                    var index_1 = -1;
                    link.fromNode.fromPort.forEach(function (port) {
                        if (port.links.length) {
                            port.links.some(function (portLink, i) {
                                if (link.id === portLink.id) {
                                    index_1 = i;
                                    return true;
                                }
                                return false;
                            });
                            if (index_1 > -1) {
                                port.links.splice(index_1, 1);
                            }
                        }
                        link.setPortEnabled(link.fromNode, port, true);
                    });
                }
            },
            removeTo: function (link) {
                if (link.toNode.toPort.links.length) {
                    var index_2 = -1;
                    link.toNode.toPort.links.some(function (portLink, i) {
                        if (link.id === portLink.id) {
                            index_2 = i;
                            return true;
                        }
                        return false;
                    });
                    if (index_2 > -1) {
                        link.toNode.toPort.links.splice(index_2, 1);
                    }
                    link.setPortEnabled(link.toNode, link.toNode.toPort, true);
                }
            },
            removeAll: function (link) {
                _this.linkHandlers.removeFrom(link);
                _this.linkHandlers.removeTo(link);
            },
            remove: function (link, type) {
                if (type === 'from') {
                    _this.linkHandlers.removeFrom(link);
                }
                else if (type === 'to') {
                    _this.linkHandlers.removeTo(link);
                }
                else {
                    _this.linkHandlers.removeAll(link);
                }
                _this.canvas.remove(link);
                _this.handlers.removeOriginById(link.id);
            },
            exception: {
                alreadyConnect: function (target) {
                    if (!target.enabled) {
                        console.warn('이미 연결된 노드가 존재 합니다.');
                        return;
                    }
                },
                duplicate: function (target) {
                    if (target.links.some(function (link) { return link.fromNode.id === _this.activeLine.fromNode; })) {
                        console.warn('중복된 연결을 할 수 없습니다.');
                        return;
                    }
                },
                alreadyDrawing: function () {
                    if (_this.interactionMode === 'link' && _this.activeLine) {
                        console.warn('이미 링크를 그리는 중입니다.');
                        return;
                    }
                },
            },
        };
        _this.drawingHandlers = {
            polygon: {
                initDraw: function () {
                    _this.modeHandlers.drawing();
                    _this.pointArray = [];
                    _this.lineArray = [];
                    _this.activeLine = null;
                    _this.activeShape = null;
                },
                finishDraw: function () {
                    _this.pointArray.forEach(function (point) {
                        _this.canvas.remove(point);
                    });
                    _this.lineArray.forEach(function (line) {
                        _this.canvas.remove(line);
                    });
                    _this.canvas.remove(_this.activeLine);
                    _this.canvas.remove(_this.activeShape);
                    _this.pointArray = [];
                    _this.lineArray = [];
                    _this.activeLine = null;
                    _this.activeShape = null;
                    _this.canvas.renderAll();
                },
                addPoint: function (opt) {
                    var id = v4_1.default();
                    var e = opt.e, absolutePointer = opt.absolutePointer;
                    var x = absolutePointer.x, y = absolutePointer.y;
                    var circle = new fabric_1.fabric.Circle({
                        id: id,
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
                    if (!_this.pointArray.length) {
                        circle.set({
                            fill: 'red',
                        });
                    }
                    var points = [x, y, x, y];
                    var line = new fabric_1.fabric.Line(points, {
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
                    if (_this.activeShape) {
                        var position = _this.canvas.getPointer(e);
                        var activeShapePoints = _this.activeShape.get('points');
                        activeShapePoints.push({
                            x: position.x,
                            y: position.y,
                        });
                        var polygon = new fabric_1.fabric.Polygon(activeShapePoints, {
                            stroke: '#333333',
                            strokeWidth: 1,
                            fill: '#cccccc',
                            opacity: 0.1,
                            selectable: false,
                            hasBorders: false,
                            hasControls: false,
                            evented: false,
                        });
                        _this.canvas.remove(_this.activeShape);
                        _this.canvas.add(polygon);
                        _this.activeShape = polygon;
                        _this.canvas.renderAll();
                    }
                    else {
                        var polyPoint = [{ x: x, y: y }];
                        var polygon = new fabric_1.fabric.Polygon(polyPoint, {
                            stroke: '#333333',
                            strokeWidth: 1,
                            fill: '#cccccc',
                            opacity: 0.1,
                            selectable: false,
                            hasBorders: false,
                            hasControls: false,
                            evented: false,
                        });
                        _this.activeShape = polygon;
                        _this.canvas.add(polygon);
                    }
                    _this.activeLine = line;
                    _this.pointArray.push(circle);
                    _this.lineArray.push(line);
                    _this.canvas.add(line);
                    _this.canvas.add(circle);
                },
                generatePolygon: function (pointArray) {
                    var points = [];
                    var id = v4_1.default();
                    pointArray.forEach(function (point) {
                        points.push({
                            x: point.left,
                            y: point.top,
                        });
                        _this.canvas.remove(point);
                    });
                    _this.lineArray.forEach(function (line) {
                        _this.canvas.remove(line);
                    });
                    _this.canvas.remove(_this.activeShape).remove(_this.activeLine);
                    var option = {
                        id: id,
                        points: points,
                        type: 'polygon',
                        stroke: 'rgba(0, 0, 0, 1)',
                        strokeWidth: 3,
                        strokeDashArray: [10, 5],
                        fill: 'rgba(0, 0, 0, 0.25)',
                        opacity: 1,
                        objectCaching: !_this.props.editable,
                        name: 'New polygon',
                        superType: 'DRAWING',
                    };
                    _this.handlers.add(option, false);
                    _this.pointArray = [];
                    _this.activeLine = null;
                    _this.activeShape = null;
                    _this.modeHandlers.selection();
                },
                // TODO... polygon resize
                createResize: function (target, points) {
                    points.forEach(function (point, index) {
                        var x = point.x, y = point.y;
                        var circle = new fabric_1.fabric.Circle({
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
                        _this.pointArray.push(circle);
                    });
                    var group = [target].concat(_this.pointArray);
                    _this.canvas.add(new fabric_1.fabric.Group(group, { type: 'polygon', id: v4_1.default() }));
                },
                removeResize: function () {
                    if (_this.pointArray) {
                        _this.pointArray.forEach(function (point) {
                            _this.canvas.remove(point);
                        });
                        _this.pointArray = [];
                    }
                },
                movingResize: function (target, e) {
                    var points = target.diffPoints || target.points;
                    var diffPoints = [];
                    points.forEach(function (point) {
                        diffPoints.push({
                            x: point.x + e.movementX,
                            y: point.y + e.movementY,
                        });
                    });
                    target.set({
                        diffPoints: diffPoints,
                    });
                    _this.canvas.renderAll();
                },
            },
            line: {},
        };
        _this.alignmentHandlers = {
            left: function () {
                var activeObject = _this.canvas.getActiveObject();
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
            },
            center: function () {
                var activeObject = _this.canvas.getActiveObject();
                if (activeObject && activeObject.type === 'activeSelection') {
                    activeObject.forEachObject(function (obj) {
                        obj.set({
                            left: 0 - ((obj.width * obj.scaleX) / 2),
                        });
                        obj.setCoords();
                        _this.canvas.renderAll();
                    });
                }
            },
            right: function () {
                var activeObject = _this.canvas.getActiveObject();
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
            },
        };
        _this.zoomHandlers = {
            zoomToPoint: function (point, zoom) {
                var _a = _this.props, onZoom = _a.onZoom, minZoom = _a.minZoom, maxZoom = _a.maxZoom;
                var zoomRatio = zoom;
                if (zoom <= (minZoom / 100)) {
                    zoomRatio = minZoom / 100;
                }
                else if (zoom >= (maxZoom / 100)) {
                    zoomRatio = maxZoom / 100;
                }
                _this.canvas.zoomToPoint(point, zoomRatio);
                _this.canvas.getObjects().forEach(function (obj) {
                    if (_this.handlers.isElementType(obj.type)) {
                        var width = obj.width * obj.scaleX * zoomRatio;
                        var height = obj.height * obj.scaleY * zoomRatio;
                        var el = _this.elementHandlers.findById(obj.id);
                        // update the element
                        _this.elementHandlers.setSize(el, width, height);
                        var _a = obj.getBoundingRect(), left = _a.left, top_1 = _a.top;
                        _this.elementHandlers.setPosition(el, left, top_1);
                        if (obj.type === 'video' && obj.player) {
                            obj.player.setPlayerSize(width, height);
                        }
                    }
                });
                if (onZoom) {
                    onZoom(zoomRatio);
                }
            },
            zoomOneToOne: function () {
                var center = _this.canvas.getCenter();
                var point = {
                    x: center.left,
                    y: center.top,
                };
                _this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                _this.zoomHandlers.zoomToPoint(point, 1);
            },
            zoomToFit: function () {
                var scaleX;
                var scaleY;
                scaleX = _this.canvas.getWidth() / _this.workarea.width;
                scaleY = _this.canvas.getHeight() / _this.workarea.height;
                if (_this.workarea.height > _this.workarea.width) {
                    scaleX = scaleY;
                    if (_this.canvas.getWidth() < _this.workarea.width * scaleX) {
                        scaleX = scaleX * (_this.canvas.getWidth() / (_this.workarea.width * scaleX));
                    }
                }
                else {
                    scaleY = scaleX;
                    if (_this.canvas.getHeight() < _this.workarea.height * scaleX) {
                        scaleX = scaleX * (_this.canvas.getHeight() / (_this.workarea.height * scaleX));
                    }
                }
                var center = _this.canvas.getCenter();
                var point = {
                    x: center.left,
                    y: center.top,
                };
                _this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                _this.zoomHandlers.zoomToPoint(point, scaleX);
            },
            zoomIn: function () {
                var zoomRatio = _this.canvas.getZoom();
                zoomRatio += 0.05;
                var center = _this.canvas.getCenter();
                var point = {
                    x: center.left,
                    y: center.top,
                };
                _this.zoomHandlers.zoomToPoint(point, zoomRatio);
            },
            zoomOut: function () {
                var zoomRatio = _this.canvas.getZoom();
                zoomRatio -= 0.05;
                var center = _this.canvas.getCenter();
                var point = {
                    x: center.left,
                    y: center.top,
                };
                _this.zoomHandlers.zoomToPoint(point, zoomRatio);
            },
        };
        _this.tooltipHandlers = {
            show: debounce_1.default(function (target) { return __awaiter(_this, void 0, void 0, function () {
                var tooltip, element, onTooltip, zoom, clientHeight, width, height, scaleX, scaleY, _a, left, top_2, offset, objWidthDiff, objHeightDiff, calcLeft, calcTop;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(target.tooltip && target.tooltip.enabled)) return [3 /*break*/, 3];
                            while (this.tooltipRef.hasChildNodes()) {
                                this.tooltipRef.removeChild(this.tooltipRef.firstChild);
                            }
                            tooltip = document.createElement('div');
                            tooltip.className = 'rde-tooltip-right';
                            element = target.name;
                            onTooltip = this.props.onTooltip;
                            if (!onTooltip) return [3 /*break*/, 2];
                            return [4 /*yield*/, onTooltip(this.tooltipRef, target)];
                        case 1:
                            element = _b.sent();
                            if (!element) {
                                return [2 /*return*/];
                            }
                            _b.label = 2;
                        case 2:
                            tooltip.innerHTML = element;
                            this.tooltipRef.appendChild(tooltip);
                            react_dom_1.default.render(element, tooltip);
                            this.tooltipRef.classList.remove('tooltip-hidden');
                            zoom = this.canvas.getZoom();
                            clientHeight = this.tooltipRef.clientHeight;
                            width = target.width, height = target.height, scaleX = target.scaleX, scaleY = target.scaleY;
                            _a = target.getBoundingRect(), left = _a.left, top_2 = _a.top;
                            offset = this.canvas.calcOffset()._offset;
                            objWidthDiff = (width * scaleX) * zoom;
                            objHeightDiff = (((height * scaleY) * zoom) / 2) - (clientHeight / 2);
                            calcLeft = offset.left + left + objWidthDiff;
                            calcTop = offset.top + top_2 + objHeightDiff;
                            if (document.body.clientWidth <= (calcLeft + this.tooltipRef.offsetWidth)) {
                                this.tooltipRef.style.left = left + offset.left - this.tooltipRef.offsetWidth + "px";
                                tooltip.className = 'rde-tooltip-left';
                            }
                            else {
                                this.tooltipRef.style.left = calcLeft + "px";
                            }
                            this.tooltipRef.style.top = calcTop + "px";
                            this.target = target;
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, 100),
            hide: debounce_1.default(function (target) {
                _this.target = null;
                _this.tooltipRef.classList.add('tooltip-hidden');
            }, 100),
        };
        _this.contextmenuHandlers = {
            show: debounce_1.default(function (e, target) { return __awaiter(_this, void 0, void 0, function () {
                var onContext, contextmenu, element, left, top;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onContext = this.props.onContext;
                            while (this.contextmenuRef.hasChildNodes()) {
                                this.contextmenuRef.removeChild(this.contextmenuRef.firstChild);
                            }
                            contextmenu = document.createElement('div');
                            contextmenu.className = 'rde-contextmenu-right';
                            return [4 /*yield*/, onContext(this.contextmenuRef, e, target)];
                        case 1:
                            element = _a.sent();
                            if (!element) {
                                return [2 /*return*/];
                            }
                            contextmenu.innerHTML = element;
                            this.contextmenuRef.appendChild(contextmenu);
                            react_dom_1.default.render(element, contextmenu);
                            this.contextmenuRef.classList.remove('contextmenu-hidden');
                            left = e.clientX, top = e.clientY;
                            this.contextmenuRef.style.left = left + "px";
                            this.contextmenuRef.style.top = top + "px";
                            return [2 /*return*/];
                    }
                });
            }); }),
            hide: debounce_1.default(function (target) {
                _this.contextmenuRef.classList.add('contextmenu-hidden');
            }, 100),
        };
        _this.guidelineHandlers = {
            init: function () {
                _this.ctx = _this.canvas.getSelectionContext();
                _this.aligningLineOffset = 5;
                _this.aligningLineMargin = 4;
                _this.aligningLineWidth = 1;
                _this.aligningLineColor = 'rgb(255, 0, 0)';
                _this.viewportTransform = _this.canvas.viewportTransform;
                _this.zoom = 1;
                _this.verticalLines = [];
                _this.horizontalLines = [];
            },
            drawVerticalLine: function (coords) {
                _this.guidelineHandlers.drawLine(coords.x + 0.5, coords.y1 > coords.y2 ? coords.y2 : coords.y1, coords.x + 0.5, coords.y2 > coords.y1 ? coords.y2 : coords.y1);
            },
            drawHorizontalLine: function (coords) {
                _this.guidelineHandlers.drawLine(coords.x1 > coords.x2 ? coords.x2 : coords.x1, coords.y + 0.5, coords.x2 > coords.x1 ? coords.x2 : coords.x1, coords.y + 0.5);
            },
            drawLine: function (x1, y1, x2, y2) {
                var _a = _this, ctx = _a.ctx, aligningLineWidth = _a.aligningLineWidth, aligningLineColor = _a.aligningLineColor, viewportTransform = _a.viewportTransform, zoom = _a.zoom;
                ctx.save();
                ctx.lineWidth = aligningLineWidth;
                ctx.strokeStyle = aligningLineColor;
                ctx.beginPath();
                ctx.moveTo((x1 * zoom) + viewportTransform[4], (y1 * zoom) + viewportTransform[5]);
                ctx.lineTo((x2 * zoom) + viewportTransform[4], (y2 * zoom) + viewportTransform[5]);
                ctx.stroke();
                ctx.restore();
            },
            isInRange: function (v1, v2) {
                var aligningLineMargin = _this.aligningLineMargin;
                v1 = Math.round(v1);
                v2 = Math.round(v2);
                for (var i = v1 - aligningLineMargin, len = v1 + aligningLineMargin; i <= len; i++) {
                    if (i === v2) {
                        return true;
                    }
                }
                return false;
            },
            movingGuidelines: function (target) {
                var canvasObjects = _this.canvas.getObjects();
                var activeObjectCenter = target.getCenterPoint();
                var activeObjectLeft = activeObjectCenter.x;
                var activeObjectTop = activeObjectCenter.y;
                var activeObjectBoundingRect = target.getBoundingRect();
                var activeObjectHeight = activeObjectBoundingRect.height / _this.viewportTransform[3];
                var activeObjectWidth = activeObjectBoundingRect.width / _this.viewportTransform[0];
                var horizontalInTheRange = false;
                var verticalInTheRange = false;
                var transform = _this.canvas._currentTransform;
                if (!transform)
                    return;
                // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
                // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move
                for (var i = canvasObjects.length; i--;) {
                    if (canvasObjects[i] === target
                        || canvasObjects[i].superType === 'port'
                        || canvasObjects[i].superType === 'link'
                        || !canvasObjects[i].evented) {
                        continue;
                    }
                    var objectCenter = canvasObjects[i].getCenterPoint();
                    var objectLeft = objectCenter.x;
                    var objectTop = objectCenter.y;
                    var objectBoundingRect = canvasObjects[i].getBoundingRect();
                    var objectHeight = objectBoundingRect.height / _this.viewportTransform[3];
                    var objectWidth = objectBoundingRect.width / _this.viewportTransform[0];
                    // snap by the horizontal center line
                    if (_this.guidelineHandlers.isInRange(objectLeft, activeObjectLeft)) {
                        verticalInTheRange = true;
                        if (canvasObjects[i].id === 'workarea') {
                            var y1 = -5000;
                            var y2 = 5000;
                            _this.verticalLines.push({
                                x: objectLeft,
                                y1: y1,
                                y2: y2,
                            });
                        }
                        else {
                            _this.verticalLines.push({
                                x: objectLeft,
                                y1: (objectTop < activeObjectTop)
                                    ? (objectTop - (objectHeight / 2) - _this.aligningLineOffset)
                                    : (objectTop + (objectHeight / 2) + _this.aligningLineOffset),
                                y2: (activeObjectTop > objectTop)
                                    ? (activeObjectTop + (activeObjectHeight / 2) + _this.aligningLineOffset)
                                    : (activeObjectTop - (activeObjectHeight / 2) - _this.aligningLineOffset),
                            });
                        }
                        target.setPositionByOrigin(new fabric_1.fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
                    }
                    // snap by the left edge
                    if (_this.guidelineHandlers.isInRange(objectLeft - (objectWidth / 2), activeObjectLeft - (activeObjectWidth / 2))) {
                        verticalInTheRange = true;
                        if (canvasObjects[i].id === 'workarea') {
                            var y1 = -5000;
                            var y2 = 5000;
                            var x = objectLeft - (objectWidth / 2);
                            if (canvasObjects[i].layout === 'fullscreen') {
                                x = 0;
                            }
                            _this.verticalLines.push({
                                x: x,
                                y1: y1,
                                y2: y2,
                            });
                        }
                        else {
                            _this.verticalLines.push({
                                x: objectLeft - (objectWidth / 2),
                                y1: (objectTop < activeObjectTop)
                                    ? (objectTop - (objectHeight / 2) - _this.aligningLineOffset)
                                    : (objectTop + (objectHeight / 2) + _this.aligningLineOffset),
                                y2: (activeObjectTop > objectTop)
                                    ? (activeObjectTop + (activeObjectHeight / 2) + _this.aligningLineOffset)
                                    : (activeObjectTop - (activeObjectHeight / 2) - _this.aligningLineOffset),
                            });
                        }
                        target.setPositionByOrigin(new fabric_1.fabric.Point(objectLeft - (objectWidth / 2) + (activeObjectWidth / 2), activeObjectTop), 'center', 'center');
                    }
                    // snap by the right edge
                    if (_this.guidelineHandlers.isInRange(objectLeft + (objectWidth / 2), activeObjectLeft + (activeObjectWidth / 2))) {
                        verticalInTheRange = true;
                        if (canvasObjects[i].id === 'workarea') {
                            var y1 = -5000;
                            var y2 = 5000;
                            var x = objectLeft + (objectWidth / 2);
                            if (canvasObjects[i].layout === 'fullscreen') {
                                x = _this.canvas.getWidth();
                            }
                            _this.verticalLines.push({
                                x: x,
                                y1: y1,
                                y2: y2,
                            });
                        }
                        else {
                            _this.verticalLines.push({
                                x: objectLeft + (objectWidth / 2),
                                y1: (objectTop < activeObjectTop)
                                    ? (objectTop - (objectHeight / 2) - _this.aligningLineOffset)
                                    : (objectTop + (objectHeight / 2) + _this.aligningLineOffset),
                                y2: (activeObjectTop > objectTop)
                                    ? (activeObjectTop + (activeObjectHeight / 2) + _this.aligningLineOffset)
                                    : (activeObjectTop - (activeObjectHeight / 2) - _this.aligningLineOffset),
                            });
                        }
                        target.setPositionByOrigin(new fabric_1.fabric.Point(objectLeft + (objectWidth / 2) - (activeObjectWidth / 2), activeObjectTop), 'center', 'center');
                    }
                    // snap by the vertical center line
                    if (_this.guidelineHandlers.isInRange(objectTop, activeObjectTop)) {
                        horizontalInTheRange = true;
                        if (canvasObjects[i].id === 'workarea') {
                            var x1 = -5000;
                            var x2 = 5000;
                            _this.horizontalLines.push({
                                y: objectTop,
                                x1: x1,
                                x2: x2,
                            });
                        }
                        else {
                            _this.horizontalLines.push({
                                y: objectTop,
                                x1: (objectLeft < activeObjectLeft)
                                    ? (objectLeft - (objectWidth / 2) - _this.aligningLineOffset)
                                    : (objectLeft + (objectWidth / 2) + _this.aligningLineOffset),
                                x2: (activeObjectLeft > objectLeft)
                                    ? (activeObjectLeft + (activeObjectWidth / 2) + _this.aligningLineOffset)
                                    : (activeObjectLeft - (activeObjectWidth / 2) - _this.aligningLineOffset),
                            });
                        }
                        target.setPositionByOrigin(new fabric_1.fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
                    }
                    // snap by the top edge
                    if (_this.guidelineHandlers.isInRange(objectTop - (objectHeight / 2), activeObjectTop - (activeObjectHeight / 2))) {
                        horizontalInTheRange = true;
                        if (canvasObjects[i].id === 'workarea') {
                            var x1 = -5000;
                            var x2 = 5000;
                            var y = objectTop - (objectHeight / 2);
                            if (canvasObjects[i].layout === 'fullscreen') {
                                y = 0;
                            }
                            _this.horizontalLines.push({
                                y: y,
                                x1: x1,
                                x2: x2,
                            });
                        }
                        else {
                            _this.horizontalLines.push({
                                y: objectTop - (objectHeight / 2),
                                x1: (objectLeft < activeObjectLeft)
                                    ? (objectLeft - (objectWidth / 2) - _this.aligningLineOffset)
                                    : (objectLeft + (objectWidth / 2) + _this.aligningLineOffset),
                                x2: (activeObjectLeft > objectLeft)
                                    ? (activeObjectLeft + (activeObjectWidth / 2) + _this.aligningLineOffset)
                                    : (activeObjectLeft - (activeObjectWidth / 2) - _this.aligningLineOffset),
                            });
                        }
                        target.setPositionByOrigin(new fabric_1.fabric.Point(activeObjectLeft, objectTop - (objectHeight / 2) + (activeObjectHeight / 2)), 'center', 'center');
                    }
                    // snap by the bottom edge
                    if (_this.guidelineHandlers.isInRange(objectTop + (objectHeight / 2), activeObjectTop + (activeObjectHeight / 2))) {
                        horizontalInTheRange = true;
                        if (canvasObjects[i].id === 'workarea') {
                            var x1 = -5000;
                            var x2 = 5000;
                            var y = objectTop + (objectHeight / 2);
                            if (canvasObjects[i].layout === 'fullscreen') {
                                y = _this.canvas.getHeight();
                            }
                            _this.horizontalLines.push({
                                y: y,
                                x1: x1,
                                x2: x2,
                            });
                        }
                        else {
                            _this.horizontalLines.push({
                                y: objectTop + (objectHeight / 2),
                                x1: (objectLeft < activeObjectLeft)
                                    ? (objectLeft - (objectWidth / 2) - _this.aligningLineOffset)
                                    : (objectLeft + (objectWidth / 2) + _this.aligningLineOffset),
                                x2: (activeObjectLeft > objectLeft)
                                    ? (activeObjectLeft + (activeObjectWidth / 2) + _this.aligningLineOffset)
                                    : (activeObjectLeft - (activeObjectWidth / 2) - _this.aligningLineOffset),
                            });
                        }
                        target.setPositionByOrigin(new fabric_1.fabric.Point(activeObjectLeft, objectTop + (objectHeight / 2) - (activeObjectHeight / 2)), 'center', 'center');
                    }
                }
                if (!horizontalInTheRange) {
                    _this.horizontalLines.length = 0;
                }
                if (!verticalInTheRange) {
                    _this.verticalLines.length = 0;
                }
            },
            scalingGuidelines: function (target) {
                // TODO...
            },
        };
        _this.gridHandlers = {
            init: function () {
                var gridOption = _this.props.gridOption;
                if (gridOption.enabled && gridOption.grid) {
                    var width = 5000;
                    var gridLength = width / gridOption.grid;
                    var lineOptions = {
                        stroke: '#ebebeb',
                        // strokeWidth: 1,
                        selectable: false,
                        evented: false,
                        id: 'grid',
                    };
                    _this.horizontalGridLines = [];
                    _this.verticalGridLines = [];
                    for (var i = 0; i < gridLength; i++) {
                        var distance = i * gridOption.grid;
                        var fhorizontal = new fabric_1.fabric.Line([distance, -width, distance, width], lineOptions);
                        var shorizontal = new fabric_1.fabric.Line([distance - width, -width, distance - width, width], lineOptions);
                        _this.canvas.add(fhorizontal);
                        _this.canvas.add(shorizontal);
                        var fvertical = new fabric_1.fabric.Line([-width, distance - width, width, distance - width], lineOptions);
                        var svertical = new fabric_1.fabric.Line([-width, distance, width, distance], lineOptions);
                        _this.canvas.add(fvertical);
                        _this.canvas.add(svertical);
                        if (i % 5 === 0) {
                            fhorizontal.set({ stroke: '#cccccc' });
                            shorizontal.set({ stroke: '#cccccc' });
                            fvertical.set({ stroke: '#cccccc', top: fvertical.top + 10 });
                            svertical.set({ stroke: '#cccccc', top: svertical.top + 10 });
                        }
                        else {
                            fvertical.set({ top: fvertical.top + 10 });
                            svertical.set({ top: svertical.top + 10 });
                        }
                    }
                }
            },
            setCoords: function (target) {
                var _a = _this.props.gridOption, enabled = _a.enabled, grid = _a.grid, snapToGrid = _a.snapToGrid;
                if (enabled && grid && snapToGrid) {
                    target.set({
                        left: Math.round(target.left / grid) * grid,
                        top: Math.round(target.top / grid) * grid,
                    });
                    target.setCoords();
                    _this.portHandlers.setCoords(target);
                }
            },
        };
        _this.eventHandlers = {
            object: {
                mousedown: function (opt) {
                    var target = opt.target;
                    if (target && target.link && target.link.enabled) {
                        var onLink = _this.props.onLink;
                        if (onLink) {
                            onLink(_this.canvas, target);
                        }
                    }
                },
            },
            modified: function (opt) {
                var onModified = _this.props.onModified;
                var target = opt.target;
                if (onModified) {
                    if (!target) {
                        return;
                    }
                    if (target.type === 'circle' && target.parentId) {
                        return;
                    }
                    onModified(target);
                }
            },
            moving: function (opt) {
                var target = opt.target;
                if (_this.interactionMode === 'crop') {
                    _this.cropHandlers.moving(opt);
                }
                else {
                    if (_this.props.editable && _this.props.guidelineOption.enabled) {
                        _this.guidelineHandlers.movingGuidelines(target);
                    }
                    if (target.superType === 'node') {
                        _this.portHandlers.setCoords(target);
                        if (target.iconButton) {
                            target.iconButton.set({
                                left: target.left + 5,
                                top: target.top + 5,
                            });
                        }
                    }
                    else if (_this.handlers.isElementType(target.type)) {
                        var el = _this.elementHandlers.findById(target.id);
                        // update the element
                        _this.elementHandlers.setPosition(el, target.left, target.top);
                    }
                }
            },
            moved: function (opt) {
                var target = opt.target;
                _this.gridHandlers.setCoords(target);
            },
            scaling: function (opt) {
                var target = opt.target;
                if (_this.interactionMode === 'crop') {
                    _this.cropHandlers.resize(opt);
                }
                // TODO...this.guidelineHandlers.scalingGuidelines(target);
                if (_this.handlers.isElementType(target.type)) {
                    var zoom = _this.canvas.getZoom();
                    var width = target.width * target.scaleX * zoom;
                    var height = target.height * target.scaleY * zoom;
                    var el = _this.elementHandlers.findById(target.id);
                    // update the element
                    _this.elementHandlers.setSize(el, width, height);
                    _this.elementHandlers.setPosition(el, target.left, target.top);
                    if (target.type === 'video' && target.player) {
                        target.player.setPlayerSize(width, height);
                    }
                }
            },
            rotating: function (opt) {
                var target = opt.target;
                if (_this.handlers.isElementType(target.type)) {
                    var el = _this.elementHandlers.findById(target.id);
                    // update the element
                    el.style.transform = "rotate(" + target.angle + "deg)";
                }
            },
            arrowmoving: function (e) {
                var activeObject = _this.canvas.getActiveObject();
                if (!activeObject) {
                    return false;
                }
                if (activeObject.id === 'workarea') {
                    return false;
                }
                if (e.keyCode === 38) {
                    activeObject.set('top', activeObject.top - 2);
                    activeObject.setCoords();
                    _this.canvas.renderAll();
                }
                else if (e.keyCode === 40) {
                    activeObject.set('top', activeObject.top + 2);
                    activeObject.setCoords();
                    _this.canvas.renderAll();
                }
                else if (e.keyCode === 37) {
                    activeObject.set('left', activeObject.left - 2);
                    activeObject.setCoords();
                    _this.canvas.renderAll();
                }
                else if (e.keyCode === 39) {
                    activeObject.set('left', activeObject.left + 2);
                    activeObject.setCoords();
                    _this.canvas.renderAll();
                }
                if (_this.props.onModified) {
                    _this.props.onModified(activeObject);
                }
            },
            mousewheel: function (opt) {
                var zoomEnabled = _this.props.zoomEnabled;
                if (!zoomEnabled) {
                    return;
                }
                var delta = opt.e.deltaY;
                var zoomRatio = _this.canvas.getZoom();
                if (delta > 0) {
                    zoomRatio -= 0.05;
                }
                else {
                    zoomRatio += 0.05;
                }
                _this.zoomHandlers.zoomToPoint(new fabric_1.fabric.Point(_this.canvas.width / 2, _this.canvas.height / 2), zoomRatio);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            },
            mousedown: function (opt) {
                if (_this.interactionMode === 'grab') {
                    _this.panning = true;
                    return;
                }
                var editable = _this.props.editable;
                var target = opt.target;
                if (editable) {
                    if (_this.prevTarget && _this.prevTarget.superType === 'link') {
                        _this.prevTarget.set({
                            stroke: _this.prevTarget.originStroke,
                        });
                    }
                    if (target && target.type === 'fromPort') {
                        if (_this.interactionMode === 'link' && _this.activeLine) {
                            console.warn('이미 링크를 그리는 중입니다.');
                            return;
                        }
                        _this.linkHandlers.init(target);
                        return;
                    }
                    if (target && _this.interactionMode === 'link' && (target.type === 'toPort' || target.superType === 'node')) {
                        var toPort = void 0;
                        if (target.superType === 'node') {
                            toPort = target.toPort;
                        }
                        else {
                            toPort = target;
                        }
                        if (toPort.links.some(function (link) { return link.fromNode.id === _this.activeLine.fromNode; })) {
                            console.warn('중복된 연결을 할 수 없습니다.');
                            return;
                        }
                        _this.linkHandlers.generate(toPort);
                        return;
                    }
                    _this.viewportTransform = _this.canvas.viewportTransform;
                    _this.zoom = _this.canvas.getZoom();
                    if (_this.interactionMode === 'selection') {
                        if (target && target.superType === 'link') {
                            target.set({
                                stroke: target.selectedStroke || 'green',
                            });
                        }
                        _this.prevTarget = target;
                    }
                    if (_this.interactionMode === 'polygon') {
                        if (target && _this.pointArray.length && target.id === _this.pointArray[0].id) {
                            _this.drawingHandlers.polygon.generatePolygon(_this.pointArray);
                        }
                        else {
                            _this.drawingHandlers.polygon.addPoint(opt);
                        }
                    }
                }
            },
            mousemove: function (opt) {
                if (_this.interactionMode === 'grab' && _this.panning) {
                    _this.modeHandlers.moving(opt.e);
                    _this.canvas.requestRenderAll();
                    return;
                }
                if (!_this.props.editable && opt.target) {
                    if (_this.handlers.isElementType(opt.target.type)) {
                        return false;
                    }
                    if (opt.target.id !== 'workarea') {
                        if (opt.target !== _this.target) {
                            _this.tooltipHandlers.show(opt.target);
                        }
                    }
                    else {
                        _this.tooltipHandlers.hide(opt.target);
                    }
                }
                if (_this.interactionMode === 'polygon') {
                    if (_this.activeLine && _this.activeLine.class === 'line') {
                        var pointer = _this.canvas.getPointer(opt.e);
                        _this.activeLine.set({ x2: pointer.x, y2: pointer.y });
                        var points = _this.activeShape.get('points');
                        points[_this.pointArray.length] = {
                            x: pointer.x,
                            y: pointer.y,
                        };
                        _this.activeShape.set({
                            points: points,
                        });
                        _this.canvas.requestRenderAll();
                    }
                }
                else if (_this.interactionMode === 'link') {
                    if (_this.activeLine && _this.activeLine.class === 'line') {
                        var pointer = _this.canvas.getPointer(opt.e);
                        _this.activeLine.set({ x2: pointer.x, y2: pointer.y });
                    }
                    _this.canvas.requestRenderAll();
                }
            },
            mouseup: function (opt) {
                if (_this.interactionMode === 'grab') {
                    _this.panning = false;
                    return;
                }
                if (_this.props.editable && _this.props.guidelineOption.enabled) {
                    _this.verticalLines.length = 0;
                    _this.horizontalLines.length = 0;
                }
                _this.canvas.renderAll();
            },
            mouseout: function (opt) {
                if (!opt.target) {
                    _this.tooltipHandlers.hide();
                }
            },
            selection: function (opt) {
                var _a = _this.props, onSelect = _a.onSelect, activeSelection = _a.activeSelection;
                var target = opt.target;
                if (target && target.type === 'activeSelection') {
                    target.set(__assign({}, activeSelection));
                }
                if (onSelect) {
                    onSelect(target);
                }
            },
            beforeRender: function (opt) {
                _this.canvas.clearContext(_this.canvas.contextTop);
            },
            afterRender: function (opt) {
                for (var i = _this.verticalLines.length; i--;) {
                    _this.guidelineHandlers.drawVerticalLine(_this.verticalLines[i]);
                }
                for (var i = _this.horizontalLines.length; i--;) {
                    _this.guidelineHandlers.drawHorizontalLine(_this.horizontalLines[i]);
                }
                _this.verticalLines.length = 0;
                _this.horizontalLines.length = 0;
            },
            resize: function (currentWidth, currentHeight, nextWidth, nextHeight) {
                _this.currentWidth = currentWidth;
                _this.canvas.setWidth(nextWidth).setHeight(nextHeight);
                if (!_this.workarea) {
                    return;
                }
                var diffWidth = (nextWidth / 2) - (currentWidth / 2);
                var diffHeight = (nextHeight / 2) - (currentHeight / 2);
                if (_this.workarea.layout === 'fixed') {
                    _this.canvas.centerObject(_this.workarea);
                    _this.workarea.setCoords();
                    _this.canvas.getObjects().forEach(function (obj, index) {
                        if (index !== 0) {
                            var left = obj.left + diffWidth;
                            var top_3 = obj.top + diffHeight;
                            var el = _this.elementHandlers.findById(obj.id);
                            _this.elementHandlers.setPosition(el, left, top_3);
                            obj.set({
                                left: left,
                                top: top_3,
                            });
                            obj.setCoords();
                        }
                    });
                    _this.canvas.renderAll();
                    return;
                }
                var scaleX = nextWidth / _this.workarea.width;
                var scaleY = nextHeight / _this.workarea.height;
                if (_this.workarea.layout === 'responsive') {
                    if (_this.workarea.height > _this.workarea.width) {
                        scaleX = scaleY;
                        if (nextWidth < _this.workarea.width * scaleX) {
                            scaleX = scaleX * (nextWidth / (_this.workarea.width * scaleX));
                        }
                    }
                    else {
                        if (nextHeight < _this.workarea.height * scaleX) {
                            scaleX = scaleX * (nextHeight / (_this.workarea.height * scaleX));
                        }
                    }
                    var deltaPoint = new fabric_1.fabric.Point(diffWidth, diffHeight);
                    _this.canvas.relativePan(deltaPoint);
                    var center = _this.canvas.getCenter();
                    var point = {
                        x: center.left,
                        y: center.top,
                    };
                    _this.zoomHandlers.zoomToPoint(point, scaleX);
                    _this.canvas.getObjects().forEach(function (obj) {
                        if (_this.handlers.isElementType(obj.type)) {
                            var width = obj.width * obj.scaleX * scaleX;
                            var height = obj.height * obj.scaleY * scaleX;
                            var _a = obj.getBoundingRect(), left = _a.left, top_4 = _a.top;
                            var el = _this.elementHandlers.findById(obj.id);
                            _this.elementHandlers.setSize(el, width, height);
                            _this.elementHandlers.setPosition(el, left, top_4);
                            if (obj.player) {
                                obj.player.setPlayerSize(width, height);
                            }
                        }
                    });
                    _this.canvas.renderAll();
                    return;
                }
                var diffScaleX = nextWidth / (_this.workarea.width * _this.workarea.scaleX);
                var diffScaleY = nextHeight / (_this.workarea.height * _this.workarea.scaleY);
                _this.workarea.set({
                    scaleX: scaleX,
                    scaleY: scaleY,
                });
                _this.canvas.getObjects().forEach(function (obj) {
                    if (obj.id !== 'workarea') {
                        var left = obj.left * diffScaleX;
                        var top_5 = obj.top * diffScaleY;
                        var width = obj.width * scaleX;
                        var height = obj.height * scaleY;
                        var el = _this.elementHandlers.findById(obj.id);
                        _this.elementHandlers.setSize(el, width, height);
                        if (obj.player) {
                            obj.player.setPlayerSize(width, height);
                        }
                        _this.elementHandlers.setPosition(el, left, top_5);
                        var newScaleX = obj.scaleX * diffScaleX;
                        var newScaleY = obj.scaleY * diffScaleY;
                        obj.set({
                            scaleX: newScaleX,
                            scaleY: newScaleY,
                            left: left,
                            top: top_5,
                        });
                        obj.setCoords();
                    }
                });
                _this.canvas.renderAll();
            },
            paste: function (e) {
                if (_this.canvas.wrapperEl !== document.activeElement) {
                    return false;
                }
                e = e || window.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                var clipboardData = e.clipboardData || window.clipboardData;
                if (clipboardData.types.length) {
                    clipboardData.types.forEach(function (clipboardType) {
                        if (clipboardType === 'text/plain') {
                            var textPlain = clipboardData.getData('text/plain');
                            var item = {
                                id: v4_1.default(),
                                type: 'textbox',
                                text: textPlain,
                            };
                            _this.handlers.add(item, true);
                        }
                        else if (clipboardType === 'text/html') {
                            // Todo ...
                            // const textHtml = clipboardData.getData('text/html');
                            // console.log(textHtml);
                        }
                        else if (clipboardType === 'Files') {
                            Array.from(clipboardData.files).forEach(function (file) {
                                var type = file.type;
                                if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
                                    var item = {
                                        id: v4_1.default(),
                                        type: 'image',
                                        file: file,
                                    };
                                    _this.handlers.add(item, true);
                                }
                                else {
                                    console.error('Not supported file type');
                                }
                            });
                        }
                    });
                }
            },
            keydown: function (e) {
                if (_this.canvas.wrapperEl !== document.activeElement) {
                    return false;
                }
                var keyEvent = _this.keyEvent;
                if (!Object.keys(keyEvent).length) {
                    return false;
                }
                var move = keyEvent.move, all = keyEvent.all, copy = keyEvent.copy, paste = keyEvent.paste, esc = keyEvent.esc, del = keyEvent.del;
                if (e.keyCode === 46 && del) {
                    _this.handlers.remove();
                }
                else if (e.code.includes('Arrow') && move) {
                    _this.eventHandlers.arrowmoving(e);
                }
                else if (e.ctrlKey && e.keyCode === 65 && all) {
                    e.preventDefault();
                    _this.handlers.allSelect();
                }
                else if (e.ctrlKey && e.keyCode === 67 && copy) {
                    e.preventDefault();
                    _this.handlers.copy();
                }
                else if (e.ctrlKey && e.keyCode === 86 && paste) {
                    e.preventDefault();
                    _this.handlers.paste();
                }
                else if (e.keyCode === 27 && esc) {
                    if (_this.interactionMode === 'selection') {
                        _this.canvas.discardActiveObject();
                    }
                    else if (_this.interactionMode === 'polygon') {
                        _this.drawingHandlers.polygon.finishDraw();
                    }
                    else if (_this.interactionMode === 'link') {
                        _this.linkHandlers.finish();
                    }
                }
            },
            contextmenu: function (e) {
                e.preventDefault();
                var _a = _this.props, editable = _a.editable, onContext = _a.onContext;
                if (editable && onContext) {
                    var target = _this.canvas.findTarget(e);
                    if (target && target.type !== 'activeSelection') {
                        _this.handlers.select(target);
                    }
                    _this.contextmenuHandlers.show(e, target);
                }
            },
            onmousedown: function (e) {
                _this.contextmenuHandlers.hide();
            },
        };
        _this.fabricObjects = CanvasObjects_1.default(props.fabricObjects, props.defaultOptions);
        _this.container = react_1.default.createRef();
        _this.keyEvent = __assign({}, defaultKeyboardEvent, props.keyEvent);
        return _this;
    }
    Canvas.prototype.componentDidMount = function () {
        var id = this.state.id;
        var _a = this.props, editable = _a.editable, canvasOption = _a.canvasOption, workareaOption = _a.workareaOption, guidelineOption = _a.guidelineOption;
        var mergedCanvasOption = __assign({}, defaultCanvasOption, canvasOption);
        this.canvas = new fabric_1.fabric.Canvas("canvas_" + id, mergedCanvasOption);
        this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
        var mergedWorkareaOption = __assign({}, defaultWorkareaOption, workareaOption);
        this.workarea = new fabric_1.fabric.Image(null, mergedWorkareaOption);
        this.canvas.add(this.workarea);
        this.objects.push(this.workarea);
        this.canvas.centerObject(this.workarea);
        this.canvas.renderAll();
        this.alignmentTools = new AlignmentTools_1.default(this.canvas);
        this.gridHandlers.init();
        var _b = this.eventHandlers, modified = _b.modified, moving = _b.moving, moved = _b.moved, scaling = _b.scaling, rotating = _b.rotating, mousewheel = _b.mousewheel, mousedown = _b.mousedown, mousemove = _b.mousemove, mouseup = _b.mouseup, mouseout = _b.mouseout, selection = _b.selection, beforeRender = _b.beforeRender, afterRender = _b.afterRender;
        if (editable) {
            this.interactionMode = 'selection';
            this.panning = false;
            if (guidelineOption.enabled) {
                this.guidelineHandlers.init();
            }
            this.contextmenuRef = document.createElement('div');
            this.contextmenuRef.id = id + "_contextmenu";
            this.contextmenuRef.className = 'rde-contextmenu contextmenu-hidden';
            document.body.appendChild(this.contextmenuRef);
            this.canvas.on({
                'object:modified': modified,
                'object:scaling': scaling,
                'object:moving': moving,
                'object:moved': moved,
                'object:rotating': rotating,
                'mouse:wheel': mousewheel,
                'mouse:down': mousedown,
                'mouse:move': mousemove,
                'mouse:up': mouseup,
                'selection:cleared': selection,
                'selection:created': selection,
                'selection:updated': selection,
                'before:render': guidelineOption.enabled ? beforeRender : null,
                'after:render': guidelineOption.enabled ? afterRender : null,
            });
            this.attachEventListener();
        }
        else {
            this.tooltipRef = document.createElement('div');
            this.tooltipRef.id = id + "_tooltip";
            this.tooltipRef.className = 'rde-tooltip tooltip-hidden';
            document.body.appendChild(this.tooltipRef);
            this.canvas.on({
                'mouse:down': mousedown,
                'mouse:move': mousemove,
                'mouse:out': mouseout,
                'mouse:up': mouseup,
                'mouse:wheel': mousewheel,
            });
        }
    };
    Canvas.prototype.componentDidUpdate = function (prevProps) {
        if (JSON.stringify(this.props.canvasOption) !== JSON.stringify(prevProps.canvasOption)) {
            var _a = this.props.canvasOption, currentWidth = _a.width, currentHeight = _a.height;
            var _b = prevProps.canvasOption, prevWidth = _b.width, prevHeight = _b.height;
            if (currentWidth !== prevWidth || currentHeight !== prevHeight) {
                this.eventHandlers.resize(prevWidth, prevHeight, currentWidth, currentHeight);
            }
            this.canvas.setBackgroundColor(this.props.canvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
            this.canvas.selection = this.props.canvasOption.selection;
        }
        if (JSON.stringify(this.props.keyEvent) !== JSON.stringify(prevProps.keyEvent)) {
            this.keyEvent = Object.assign({}, defaultKeyboardEvent, this.props.keyEvent);
        }
        if (JSON.stringify(this.props.fabricObjects) !== JSON.stringify(prevProps.fabricObjects)) {
            this.fabricObjects = CanvasObjects_1.default(this.props.fabricObjects);
        }
        else if (JSON.stringify(this.props.workareaOption) !== JSON.stringify(prevProps.workareaOption)) {
            this.workarea.set(__assign({}, this.props.workareaOption));
        }
        else if (JSON.stringify(this.props.guidelineOption) !== JSON.stringify(prevProps.guidelineOption)) {
            if (this.props.guidelineOption.enabled) {
                this.canvas.on({
                    'before:render': this.eventHandlers.beforeRender,
                    'after:render': this.eventHandlers.afterRender,
                });
            }
            else {
                this.canvas.off({
                    'before:render': this.eventHandlers.beforeRender,
                    'after:render': this.eventHandlers.afterRender,
                });
            }
        }
    };
    Canvas.prototype.componentWillUnmount = function () {
        var _this = this;
        this.detachEventListener();
        var _a = this.eventHandlers, modified = _a.modified, moving = _a.moving, moved = _a.moved, scaling = _a.scaling, rotating = _a.rotating, mousewheel = _a.mousewheel, mousedown = _a.mousedown, mousemove = _a.mousemove, mouseup = _a.mouseup, mouseout = _a.mouseout, selection = _a.selection, beforeRender = _a.beforeRender, afterRender = _a.afterRender;
        if (this.props.editable) {
            this.canvas.off({
                'object:modified': modified,
                'object:scaling': scaling,
                'object:moving': moving,
                'object:moved': moved,
                'object:rotating': rotating,
                'mouse:wheel': mousewheel,
                'mouse:down': mousedown,
                'mouse:move': mousemove,
                'mouse:up': mouseup,
                'selection:cleared': selection,
                'selection:created': selection,
                'selection:updated': selection,
                'before:render': beforeRender,
                'after:render': afterRender,
            });
        }
        else {
            this.canvas.off({
                'mouse:down': mousedown,
                'mouse:move': mousemove,
                'mouse:out': mouseout,
                'mouse:up': mouseup,
                'mouse:wheel': mousewheel,
            });
            this.canvas.getObjects().forEach(function (object) {
                object.off('mousedown', _this.eventHandlers.object.mousedown);
                if (object.anime) {
                    animejs_1.default.remove(object);
                }
            });
        }
        this.handlers.clear(true);
        if (this.tooltipRef) {
            document.body.removeChild(this.tooltipRef);
        }
    };
    Canvas.prototype.render = function () {
        var id = this.state.id;
        return (react_1.default.createElement("div", { ref: this.container, id: "rde-canvas", className: "rde-canvas", style: { width: '100%', height: '100%' } },
            react_1.default.createElement("canvas", { id: "canvas_" + id })));
    };
    Canvas.defaultProps = {
        editable: true,
        canvasOption: {
            selection: true,
        },
        defaultOptions: {},
        activeSelection: {
            hasControls: true,
        },
        zoomEnabled: true,
        minZoom: 0,
        maxZoom: 300,
        propertiesToInclude: [],
        workareaOption: {},
        gridOption: {
            enabled: false,
            grid: 50,
            snapToGrid: false,
        },
        guidelineOption: {
            enabled: true,
        },
        keyEvent: {},
    };
    return Canvas;
}(react_1.Component));
exports.default = Canvas;
