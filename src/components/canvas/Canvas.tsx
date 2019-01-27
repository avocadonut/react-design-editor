import React, { Component } from 'react';
import { fabric } from 'fabric';
import uuid from 'uuid/v4';
import anime, { AnimeInstance } from 'animejs';

import CanvasObjects from './CanvasObjects';
import OrthogonalLink from '../workflow/link/OrthogonalLink';
import CurvedLink from '../workflow/link/CurvedLink';

import '../../styles/core/tooltip.less';
import '../../styles/core/contextmenu.less';
import AlignmentTools, { IAlignmentTools } from './tools/AlignmentTools';
import GridTools, { IGridTools } from './tools/GridTools';
import CropTools, { ICropTools } from './tools/CropTools';
import GeneralTools, { IGeneralTools } from './tools/GeneralTools';
import ModeTools, { IModeTools } from './tools/ModeTools';
import TooltipTools, { ITooltipTools } from './tools/TooltipTools';
import ZoomTools, { IZoomTools } from './tools/ZoomTools';
import ElementTools, { IElementTools } from './tools/ElementTools';
import AnimationTools, { IAnimationTools } from './tools/AnimationTools';
import VideoTools, { IVideoTools } from './tools/VideoTools';
import ContextmenuTools, { IContextmenuTools } from './tools/ContextmenuTools';
import LinkTools, { ILinkTools } from './tools/LinkTools';
import EventTools, { IEventTools } from './tools/EventTools';
import NodeTools, { INodeTools } from './tools/NodeTools';
import PortTools, { IPortTools } from './tools/PortTools';
import WorkareaTools, { IWorkareaTools } from './tools/WorkareaTools';
import GuidelineTools, { IGuidelineTools } from './tools/GuidelineTools';
import DrawingTools, { IDrawingTools } from './tools/DrawingTools';

export interface ICanvasOption extends fabric.ICanvasOptions {
    width?: number;
    height?: number;
}

export type LayoutType = 'fixed' | 'responsive' | 'fullscreen';

export type InteractionModeType = 'selection' | 'grab' | 'crop' | 'polygon' | 'link';

export interface ILinkProperty {
    enabled?: boolean;
}

export interface ITooltipProperty {
    enabled?: boolean;
}

export type AnimationType = 'none' | 'fade' | 'bounce' | 'shake' | 'scaling' | 'rotation' | 'flash';

export interface IAnimationProperty {
    type?: AnimationType;
    delay?: number;
    duration?: number;
    autoplay?: boolean;
    loop?: boolean;
}

export interface IVideoProperty {
    type?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    preload?: string;
    contols?: boolean;
    file?: File;
    src?: any;
}

export interface IWorkareaOption extends fabric.IImageOptions {
    id?: string;
    layout?: LayoutType;
    workareaWidth?: number;
    workareaHeight?: number;
}

export interface IKeyboardEvent {
    move?: boolean;
    all?: boolean;
    copy?: boolean;
    paste?: boolean;
    esc?: boolean;
    del?: boolean;
}

export interface IGridOption {
    enabled?: boolean;
    grid?: number;
    snapToGrid?: boolean;
}

export interface IGuidelineOption {
    enabled?: boolean;
}

export interface IStaticCanvas extends fabric.Canvas {
    id?: string;
    interactionMode?: InteractionModeType;
    editable?: boolean;
    panning?: boolean;
    wrapperEl?: HTMLElement;
    generalTools?: IGeneralTools;
    gridTools?: IGridTools;
    alignmentTools?: IAlignmentTools;
    cropTools?: ICropTools;
    modeTools?: IModeTools;
    tooltipTools?: ITooltipTools;
    zoomTools?: IZoomTools;
    elementTools?: IElementTools;
    animationTools?: IAnimationTools;
    videoTools?: IVideoTools;
    contextmenuTools?: IContextmenuTools;
    eventTools?: IEventTools;
    portTools?: IPortTools;
    nodeTools?: INodeTools;
    linkTools?: ILinkTools;
    workareaTools?: IWorkareaTools;
    guidelineTools?: IGuidelineTools;
    drawingTools?: IDrawingTools;
}

export interface IStaticObject extends fabric.Object {
    id?: string;
    link?: ILinkProperty;
    tooltip?: ITooltipProperty;
    animation?: IAnimationProperty;
    video?: IVideoProperty;
    anime?: AnimeInstance;
    player?: any;
    superType?: string;
    lock?: boolean;
    parentId?: string;
}

export type IStaticImage = IStaticObject & fabric.Image;

export type IStaticWorkarea = IStaticObject & IWorkareaOption;

export interface ICanvasProps {
    fabricObjects?: object;
    editable?: boolean;
    canvasOption?: ICanvasOption;
    defaultOptions?: any;
    activeSelection?: fabric.IObjectOptions;
    zoomEnabled?: boolean;
    minZoom?: number;
    maxZoom?: number;
    propertiesToInclude?: string[];
    guidelineOption?: IGuidelineOption;
    workareaOption?: IWorkareaOption;
    gridOption?: IGridOption;
    onModified?(target: fabric.Object): void;
    onAdd?(target: fabric.Object): void;
    onRemove?(target: fabric.Object): void;
    onSelect?(target: fabric.Object): void;
    onZoom?(zoomRatio: number): void;
    onTooltip?(tooltipRef: HTMLDivElement, target: fabric.Object): React.DOMElement<React.DOMAttributes<Element>, Element>;
    onContext?: (contextmenuRef: HTMLDivElement, e: MouseEvent, target: fabric.Object) => React.DOMElement<React.DOMAttributes<Element>, Element>;
    onLink?(canvas: fabric.Canvas, target: fabric.Object): void;
    keyEvent?: IKeyboardEvent;
}

export interface ICanvasState {
    id: string;
    clipboard?: any;
}

export const defaultCanvasOption: ICanvasOption = {
    preserveObjectStacking: true,
    width: 300,
    height: 150,
    selection: true,
    defaultCursor: 'default',
    backgroundColor: '#fff',
};

export const defaultWorkareaOption: IWorkareaOption = {
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
    layout: 'fixed', // fixed, responsive, fullscreen
};

export const defaultKeyboardEvent: IKeyboardEvent = {
    move: true,
    all: true,
    copy: true,
    paste: true,
    esc: true,
    del: true,
};

class Canvas extends Component<ICanvasProps, ICanvasState> {
    static defaultProps: ICanvasProps = {
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

    canvas: IStaticCanvas;
    workarea: IStaticWorkarea;
    objects: IStaticObject[];
    fabricObjects?: any;
    keyEvent?: IKeyboardEvent;
    container?: React.RefObject<HTMLDivElement>;

    constructor(props: ICanvasProps) {
        super(props);
        this.objects = [];
        this.fabricObjects = CanvasObjects(props.fabricObjects, props.defaultOptions);
        this.container = React.createRef();
        this.keyEvent = { ...defaultKeyboardEvent, ...props.keyEvent };
    }

    state: ICanvasState = {
        id: uuid(),
        clipboard: null,
    };

    componentDidMount() {
        const { id } = this.state;
        const {
            editable,
            canvasOption,
            workareaOption,
            guidelineOption,
        } = this.props;
        const mergedCanvasOption = { ...defaultCanvasOption, ...canvasOption };
        this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption);
        this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, null);
        const mergedWorkareaOption = { ...defaultWorkareaOption, ...workareaOption };
        this.workarea = new fabric.Image(null, mergedWorkareaOption) as IStaticWorkarea;
        this.canvas.add(this.workarea);
        this.objects.push(this.workarea);
        this.canvas.centerObject(this.workarea);
        this.canvas.renderAll();
        this.canvas.id = id;
        this.applyTools();
        const {
            modified,
            moving,
            moved,
            scaling,
            rotating,
            mousewheel,
            mousedown,
            mousemove,
            mouseup,
            mouseout,
            selection,
            beforeRender,
            afterRender,
        } = this.canvas.eventTools;
        console.log(this.canvas);
        if (editable) {
            this.canvas.interactionMode = 'selection';
            this.canvas.editable = editable;
            this.canvas.panning = false;
            if (guidelineOption.enabled) {
                this.guidelineHandlers.init();
            }
            this.canvas.contextmenuTools.create();
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
                // 'before:render': guidelineOption.enabled ? beforeRender : null,
                // 'after:render': guidelineOption.enabled ? afterRender : null,
            });
            this.attachEventListener();
        } else {
            this.canvas.tooltipTools.create();
            this.canvas.on({
                'mouse:down': mousedown,
                'mouse:move': mousemove,
                'mouse:out': mouseout,
                'mouse:up': mouseup,
                'mouse:wheel': mousewheel,
            });
        }
    }

    componentDidUpdate(prevProps: ICanvasProps) {
        if (JSON.stringify(this.props.canvasOption) !== JSON.stringify(prevProps.canvasOption)) {
            const { canvasOption: { width: currentWidth, height: currentHeight } } = this.props;
            const { canvasOption: { width: prevWidth, height: prevHeight } } = prevProps;
            if (currentWidth !== prevWidth || currentHeight !== prevHeight) {
                this.canvas.eventTools.resize(prevWidth, prevHeight, currentWidth, currentHeight);
            }
            this.canvas.setBackgroundColor(this.props.canvasOption.backgroundColor, null);
            this.canvas.selection = this.props.canvasOption.selection;
        }
        if (JSON.stringify(this.props.keyEvent) !== JSON.stringify(prevProps.keyEvent)) {
            this.keyEvent = Object.assign({}, defaultKeyboardEvent, this.props.keyEvent);
        }
        if (JSON.stringify(this.props.fabricObjects) !== JSON.stringify(prevProps.fabricObjects)) {
            this.fabricObjects = CanvasObjects(this.props.fabricObjects);
        } else if (JSON.stringify(this.props.workareaOption) !== JSON.stringify(prevProps.workareaOption)) {
            this.workarea.set({
                ...this.props.workareaOption,
            });
        } else if (JSON.stringify(this.props.guidelineOption) !== JSON.stringify(prevProps.guidelineOption)) {
            if (this.props.guidelineOption.enabled) {
                this.canvas.on({
                    'before:render': this.canvas.eventTools.beforeRender,
                    'after:render': this.canvas.eventTools.afterRender,
                });
            } else {
                this.canvas.off({
                    'before:render': this.canvas.eventTools.beforeRender,
                    'after:render': this.canvas.eventTools.afterRender,
                });
            }
        }
    }

    componentWillUnmount() {
        this.detachEventListener();
        const {
            modified,
            moving,
            moved,
            scaling,
            rotating,
            mousewheel,
            mousedown,
            mousemove,
            mouseup,
            mouseout,
            selection,
            beforeRender,
            afterRender,
        } = this.canvas.eventTools;
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
        } else {
            this.canvas.off({
                'mouse:down': mousedown,
                'mouse:move': mousemove,
                'mouse:out': mouseout,
                'mouse:up': mouseup,
                'mouse:wheel': mousewheel,
            });
            this.canvas.getObjects().forEach((object: IStaticObject) => {
                object.off('mousedown', this.canvas.eventTools.object.mousedown);
                if (object.anime) {
                    anime.remove(object);
                }
            });
        }
        this.canvas.generalTools.clear(true);
        this.canvas.contextmenuTools.remove();
        this.canvas.tooltipTools.remove();
    }

    attachEventListener = () => {
        // if add canvas wrapper element event, tabIndex = 1000;
        this.canvas.wrapperEl.tabIndex = 1000;
        document.addEventListener('keydown', this.canvas.eventTools.keydown, false);
        document.addEventListener('paste', this.canvas.eventTools.paste, false);
        document.addEventListener('mousedown', this.canvas.eventTools.onmousedown, false);
        this.canvas.wrapperEl.addEventListener('contextmenu', this.canvas.eventTools.contextmenu, false);
    }

    detachEventListener = () => {
        document.removeEventListener('keydown', this.canvas.eventTools.keydown);
        document.removeEventListener('paste', this.canvas.eventTools.paste);
        document.removeEventListener('mousedown', this.canvas.eventTools.onmousedown);
        this.canvas.wrapperEl.removeEventListener('contextmenu', this.canvas.eventTools.contextmenu);
    }

    applyTools = () => {
        const {
            editable,
            canvasOption,
            workareaOption,
            guidelineOption,
            gridOption,
            defaultOptions,
            minZoom,
            maxZoom,
            propertiesToInclude,
            activeSelection,
            zoomEnabled,
            onTooltip,
            onZoom,
            onSelect,
            onContext,
            onLink,
            onModified,
        } = this.props;
        const defaultToolOption = {
            canvas: this.canvas,
            workarea: this.workarea,
            container: this.container,
            objects: this.objects,
            fabricObjects: this.fabricObjects,
            gridOption,
            defaultOptions,
            editable,
            canvasOption,
            workareaOption,
            guidelineOption,
            propertiesToInclude,
            activeSelection,
            zoomEnabled,
            onTooltip,
            onZoom,
            onSelect,
            onContext,
            onLink,
            onModified,
        };
        this.canvas.generalTools = new GeneralTools(defaultToolOption);
        this.canvas.alignmentTools = new AlignmentTools(defaultToolOption);
        this.canvas.gridTools = new GridTools(defaultToolOption);
        this.canvas.cropTools = new CropTools(defaultToolOption);
        this.canvas.tooltipTools = new TooltipTools(defaultToolOption);
        this.canvas.modeTools = new ModeTools(defaultToolOption);
        this.canvas.zoomTools = new ZoomTools(defaultToolOption, minZoom, maxZoom);
        this.canvas.animationTools = new AnimationTools(defaultToolOption);
        this.canvas.elementTools = new ElementTools(defaultToolOption);
        this.canvas.contextmenuTools = new ContextmenuTools(defaultToolOption);
        this.canvas.videoTools = new VideoTools(defaultToolOption);
        this.canvas.linkTools = new LinkTools(defaultToolOption);
        this.canvas.portTools = new PortTools(defaultToolOption);
        this.canvas.nodeTools = new NodeTools(defaultToolOption);
        this.canvas.eventTools = new EventTools(defaultToolOption);
        this.canvas.workareaTools = new WorkareaTools(defaultToolOption);
        this.canvas.guidelineTools = new GuidelineTools(defaultToolOption);
        this.canvas.drawingTools = new DrawingTools(defaultToolOption);
    }

    workareaHandlers = {
        setLayout: (value) => {
            this.workarea.set('layout', value);
            const { canvas } = this;
            const { _element } = this.workarea;
            let scaleX = 1;
            let scaleY = 1;
            const isFixed = value === 'fixed';
            const isResponsive = value === 'responsive';
            const isFullscreen = value === 'fullscreen';
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
                    this.canvas.zoomTools.zoomToPoint(point, scaleX);
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
                const width = isFixed ? this.workarea.workareaWidth : this.canvas.getWidth();
                const height = isFixed ? this.workarea.workareaHeight : this.canvas.getHeight();
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
            this.canvas.zoomTools.zoomToPoint(point, 1);
            canvas.renderAll();
        },
        setResponsiveImage: (src, loaded) => {
            const { canvas, workarea } = this;
            const { editable } = this.props;
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
                                const el = this.canvas.elementTools.findById(obj.id);
                                this.canvas.elementTools.setSize(el, objWidth, objHeight);
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
        },
        setImage: (src, loaded = false) => {
            const { canvas, workarea, workareaHandlers } = this;
            const { editable } = this.props;
            if (workarea.layout === 'responsive') {
                workareaHandlers.setResponsiveImage(src, loaded);
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
        },
    }

    nodeHandlers = {
        selectByPath: (path) => {
            if (!path || !path.length) {
                return;
            }
            const splitPath = path.reduce((prev, curr, index) => {
                if (!path[index + 1]) {
                    return prev;
                }
                const newPath = [path[index], path[index + 1]];
                prev.push(newPath);
                return prev;
            }, []);
            const targetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id === object.id));
            const nonTargetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id !== object.id));
            nonTargetObjects.forEach((object) => {
                if (object.superType === 'link') {
                    const { fromNode, toNode } = object;
                    if (splitPath.some(findPath => fromNode.id === findPath[0] && toNode.id === findPath[1])) {
                        object.set({
                            opacity: 1,
                        });
                        object.setShadow({
                            color: object.stroke,
                        });
                        this.canvas.nodeTools.highlightingNode(object, 300);
                        this.canvas.renderAll();
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
                    object.fromPort.forEach((port) => {
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
            targetObjects.forEach((object) => {
                object.set({
                    opacity: 1,
                });
                object.setShadow({
                    color: object.fill,
                });
                this.canvas.nodeTools.highlightingNode(object, 300);
                if (object.toPort) {
                    object.toPort.set({
                        opacity: 1,
                    });
                }
                if (object.fromPort) {
                    object.fromPort.forEach((port) => {
                        port.set({
                            opacity: 1,
                        });
                    });
                }
            });
            this.canvas.renderAll();
        },
        selectById: (id) => {
            this.canvas.generalTools.getOriginObjects().forEach((object) => {
                if (id === object.id) {
                    object.setShadow({
                        color: object.fill,
                        blur: 50,
                    });
                    return;
                } else if (id === object.nodeId) {
                    return;
                }
                object.setShadow({
                    blur: 0,
                });
            });
            this.canvas.renderAll();
        },
        deselect: () => {
            this.canvas.generalTools.getOriginObjects().forEach((object) => {
                object.set({
                    opacity: 1,
                });
                if (object.superType === 'node') {
                    if (object.toPort) {
                        object.toPort.set({
                            opacity: 1,
                        });
                    }
                    object.fromPort.forEach((port) => {
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
            this.canvas.renderAll();
        },
        highlightingByPath: (path) => {
            if (!path || !path.length) {
                return;
            }
            const splitPath = path.reduce((prev, curr, index) => {
                if (!path[index + 1]) {
                    return prev;
                }
                const newPath = [path[index], path[index + 1]];
                prev.push(newPath);
                return prev;
            }, []);
            const targetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id === object.id));
            const nonTargetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id !== object.id));
            const lastObject = targetObjects.filter(obj => obj.id === path[path.length - 1])[0];
            targetObjects.forEach((object) => {
                if (lastObject) {
                    object.setShadow({
                        color: lastObject.fill,
                    });
                } else {
                    object.setShadow({
                        color: object.fill,
                    });
                }
                this.canvas.nodeTools.highlightingNode(object);
            });
            nonTargetObjects.forEach((object) => {
                if (object.superType === 'link') {
                    const { fromNode, toNode } = object;
                    if (splitPath.some(findPath => fromNode.id === findPath[0] && toNode.id === findPath[1])) {
                        if (lastObject) {
                            object.setShadow({
                                color: lastObject.stroke,
                            });
                        } else {
                            object.setShadow({
                                color: object.stroke,
                            });
                        }
                        this.canvas.nodeTools.highlightingNode(object);
                        this.canvas.nodeTools.highlightingLink(object, lastObject);
                    }
                }
            });
            this.canvas.renderAll();
        },
        highlightingLink: (object, targetObject, duration = 500) => {
            object.animation = {
                duration,
                type: 'flash',
                stroke: targetObject ? targetObject.stroke : object.stroke,
                loop: 1,
                delay: 0,
            };
            this.canvas.animationTools.play(object.id, false);
        },
        highlightingNode: (object, duration = 500) => {
            const maxBlur = 50;
            const minBlur = 0;
            const onComplete = () => {
                if (object.shadow.blur === maxBlur) {
                    object.isAnimated = true;
                    object.animate('shadow.blur', minBlur, {
                        easing: fabric.util.ease.easeInOutQuad,
                        onChange: (value) => {
                            object.shadow.blur = value;
                            this.canvas.renderAll();
                        },
                        onComplete: () => {
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
                easing: fabric.util.ease.easeInOutQuad,
                duration,
                onChange: (value) => {
                    object.shadow.blur = value;
                    this.canvas.renderAll();
                },
                onComplete,
            });
        },
    }

    portHandlers = {
        createPort: (target) => {
            if (!target.createToPort) {
                return;
            }
            const toPort = target.createToPort(target.left + (target.width / 2), target.top);
            if (toPort) {
                toPort.on('mouseover', () => {
                    if (this.canvas.interactionMode === 'link' && this.activeLine && this.activeLine.class === 'line') {
                        if (toPort.links.some(link => link.fromNode.id ===  this.activeLine.fromNode)) {
                            toPort.set({
                                fill: toPort.errorFill,
                            });
                            this.canvas.renderAll();
                            return;
                        }
                        toPort.set({
                            fill: toPort.hoverFill,
                        });
                        this.canvas.renderAll();
                    }
                });
                toPort.on('mouseout', () => {
                    toPort.set({
                        fill: toPort.originFill,
                    });
                    this.canvas.renderAll();
                });
                this.canvas.add(toPort);
                toPort.setCoords();
                this.canvas.bringToFront(toPort);
            }
            const fromPort = target.createFromPort(target.left + (target.width / 2), target.top + target.height);
            if (fromPort && fromPort.length) {
                fromPort.forEach((port) => {
                    if (port) {
                        port.on('mouseover', () => {
                            if (port.enabled) {
                                if (this.activeLine) {
                                    port.set({
                                        fill: port.errorFill,
                                    });
                                    this.canvas.renderAll();
                                    return;
                                }
                                port.set({
                                    fill: port.hoverFill,
                                });
                                this.canvas.renderAll();
                                return;
                            }
                            port.set({
                                fill: port.errorFill,
                            });
                            this.canvas.renderAll();
                        });
                        port.on('mouseout', () => {
                            port.set({
                                fill: port.originFill,
                            });
                            this.canvas.renderAll();
                        });
                        this.canvas.add(port);
                        port.setCoords();
                        this.canvas.bringToFront(port);
                    }
                });
            }
        },
        setCoords: (target) => {
            if (target.toPort) {
                const toCoords = {
                    left: target.left + (target.width / 2),
                    top: target.top,
                };
                target.toPort.set({
                    ...toCoords,
                });
                target.toPort.setCoords();
                if (target.toPort.links.length) {
                    target.toPort.links.forEach((link) => {
                        const fromPort = link.fromNode.fromPort.filter(port => port.id === link.fromPort)[0];
                        this.canvas.linkTools.setCoords(fromPort.left, fromPort.top, toCoords.left, toCoords.top, link);
                    });
                }
            }
            if (target.fromPort) {
                const fromCoords = {
                    left: target.left + (target.width / 2),
                    top: target.top + target.height,
                };
                target.fromPort.forEach((port) => {
                    const left = port.leftDiff ? fromCoords.left + port.leftDiff : fromCoords.left;
                    const top = port.topDiff ? fromCoords.top + port.topDiff : fromCoords.top;
                    port.set({
                        left,
                        top,
                    });
                    port.setCoords();
                    if (port.links.length) {
                        port.links.forEach((link) => {
                            this.canvas.linkTools.setCoords(left, top, link.toNode.toPort.left, link.toNode.toPort.top, link);
                        });
                    }
                });
            }
        },
        recreatePort: (target) => {
            const { fromPort, toPort } = target;
            if (target.ports) {
                target.ports.forEach((port) => {
                    target.removeWithUpdate(port);
                    this.canvas.remove(port.fromPort);
                });
            }
            this.canvas.remove(target.toPort);
            if (target.toPort) {
                target.toPort.links.forEach((link) => {
                    this.canvas.linkTools.remove(link, 'from');
                });
            }
            if (target.fromPort) {
                target.fromPort.forEach((port) => {
                    if (port.links.length) {
                        port.links.forEach((link) => {
                            this.canvas.linkTools.remove(link, 'to');
                        });
                    }
                });
            }
            this.canvas.portTools.createPort(target);
            toPort.links.forEach((link) => {
                link.fromNode = link.fromNode.id;
                link.toNode = target.toPort.nodeId;
                this.canvas.linkTools.create(link);
            });
            fromPort.filter(op => target.fromPort.some(np => np.id === op.id)).forEach((port) => {
                port.links.forEach((link) => {
                    if (link.fromPort === port.id) {
                        link.fromNode = port.nodeId;
                        link.toNode = link.toNode.id;
                        this.canvas.linkTools.create(link);
                        this.canvas.portTools.setCoords(target);
                    }
                });
            });
        },
    }

    linkHandlers = {
        init: (target) => {
            if (!target.enabled) {
                console.warn('이미 연결된 노드가 존재 합니다.');
                return;
            }
            this.canvas.interactionMode = 'link';
            const { left, top } = target;
            // const points = [left, top, left, top];
            const fromPort = { left, top };
            const toPort = { left, top };
            this.activeLine = new CurvedLink(target.nodeId, fromPort, null, toPort, {
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
            this.canvas.add(this.activeLine);
        },
        finish: () => {
            this.canvas.interactionMode = 'selection';
            this.canvas.remove(this.activeLine);
            this.activeLine = null;
            this.canvas.renderAll();
        },
        generate: (target) => {
            if (target.nodeId === this.activeLine.fromNode) {
                console.warn('같은 노드를 선택할 수 없습니다.');
                return;
            }
            const link = {
                type: 'CurvedLink',
                fromNode: this.activeLine.fromNode,
                fromPort: this.activeLine.fromPort,
                toNode: target.nodeId,
                toPort: target.id,
            };
            this.canvas.linkTools.create(link, true);
            this.canvas.linkTools.finish();
        },
        create: (link, init = false) => {
            const fromNode = this.canvas.generalTools.findById(link.fromNode);
            const fromPort = fromNode.fromPort.filter(port => port.id === link.fromPort || !port.id)[0];
            const toNode = this.canvas.generalTools.findById(link.toNode);
            const { toPort } = toNode;
            const createdObj = this.fabricObjects[link.type].create(fromNode, fromPort, toNode, toPort, { ...link });
            this.canvas.add(createdObj);
            this.objects.push(createdObj);
            const { onAdd } = this.props;
            if (onAdd && this.props.editable && init) {
                onAdd(createdObj);
            }
            this.canvas.renderAll();
            createdObj.setPort(fromNode, fromPort, toNode, toPort);
            this.canvas.portTools.setCoords(fromNode);
            this.canvas.portTools.setCoords(toNode);
            return createdObj;
        },
        setCoords: (x1, y1, x2, y2, link) => {
            link.set({
                x1,
                y1,
                x2,
                y2,
            });
            link.setCoords();
        },
        removeFrom: (link) => {
            if (link.fromNode.fromPort.length) {
                let index = -1;
                link.fromNode.fromPort.forEach((port) => {
                    if (port.links.length) {
                        port.links.some((portLink, i) => {
                            if (link.id === portLink.id) {
                                index = i;
                                return true;
                            }
                            return false;
                        });
                        if (index > -1) {
                            port.links.splice(index, 1);
                        }
                    }
                    link.setPortEnabled(link.fromNode, port, true);
                });
            }
        },
        removeTo: (link) => {
            if (link.toNode.toPort.links.length) {
                let index = -1;
                link.toNode.toPort.links.some((portLink, i) => {
                    if (link.id === portLink.id) {
                        index = i;
                        return true;
                    }
                    return false;
                });
                if (index > -1) {
                    link.toNode.toPort.links.splice(index, 1);
                }
                link.setPortEnabled(link.toNode, link.toNode.toPort, true);
            }
        },
        removeAll: (link) => {
            this.canvas.linkTools.removeFrom(link);
            this.canvas.linkTools.removeTo(link);
        },
        remove: (link, type) => {
            if (type === 'from') {
                this.canvas.linkTools.removeFrom(link);
            } else if (type === 'to') {
                this.canvas.linkTools.removeTo(link);
            } else {
                this.canvas.linkTools.removeAll(link);
            }
            this.canvas.remove(link);
            this.canvas.generalTools.removeOriginById(link.id);
        },
        exception: {
            alreadyConnect: (target) => {
                if (!target.enabled) {
                    console.warn('이미 연결된 노드가 존재 합니다.');
                    return;
                }
            },
            duplicate: (target) => {
                if (target.links.some(link => link.fromNode.id === this.activeLine.fromNode)) {
                    console.warn('중복된 연결을 할 수 없습니다.');
                    return;
                }
            },
            alreadyDrawing: () => {
                if (this.canvas.interactionMode === 'link' && this.activeLine) {
                    console.warn('이미 링크를 그리는 중입니다.');
                    return;
                }
            },
        },
    }

    drawingHandlers = {
        polygon: {
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
            },
            addPoint: (opt) => {
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
                    objectCaching: !this.props.editable,
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
        },
        line: {
            
        },
    }

    guidelineHandlers = {
        init: () => {
            this.ctx = this.canvas.getSelectionContext();
            this.aligningLineOffset = 5;
            this.aligningLineMargin = 4;
            this.aligningLineWidth = 1;
            this.aligningLineColor = 'rgb(255, 0, 0)';
            this.viewportTransform = this.canvas.viewportTransform;
            this.zoom = 1;
            this.verticalLines = [];
            this.horizontalLines = [];
        },
        drawVerticalLine: (coords) => {
            this.guidelineHandlers.drawLine(
                coords.x + 0.5,
                coords.y1 > coords.y2 ? coords.y2 : coords.y1,
                coords.x + 0.5,
                coords.y2 > coords.y1 ? coords.y2 : coords.y1,
            );
        },
        drawHorizontalLine: (coords) => {
            this.guidelineHandlers.drawLine(
                coords.x1 > coords.x2 ? coords.x2 : coords.x1,
                coords.y + 0.5,
                coords.x2 > coords.x1 ? coords.x2 : coords.x1,
                coords.y + 0.5,
            );
        },
        drawLine: (x1, y1, x2, y2) => {
            const { ctx, aligningLineWidth, aligningLineColor, viewportTransform, zoom } = this;
            ctx.save();
            ctx.lineWidth = aligningLineWidth;
            ctx.strokeStyle = aligningLineColor;
            ctx.beginPath();
            ctx.moveTo((x1 * zoom) + viewportTransform[4], (y1 * zoom) + viewportTransform[5]);
            ctx.lineTo((x2 * zoom) + viewportTransform[4], (y2 * zoom) + viewportTransform[5]);
            ctx.stroke();
            ctx.restore();
        },
        isInRange: (v1, v2) => {
            const { aligningLineMargin } = this;
            v1 = Math.round(v1);
            v2 = Math.round(v2);
            for (let i = v1 - aligningLineMargin, len = v1 + aligningLineMargin; i <= len; i++) {
                if (i === v2) {
                    return true;
                }
            }
            return false;
        },
        movingGuidelines: (target) => {
            const canvasObjects = this.canvas.getObjects();
            const activeObjectCenter = target.getCenterPoint();
            const activeObjectLeft = activeObjectCenter.x;
            const activeObjectTop = activeObjectCenter.y;
            const activeObjectBoundingRect = target.getBoundingRect();
            const activeObjectHeight = activeObjectBoundingRect.height / this.viewportTransform[3];
            const activeObjectWidth = activeObjectBoundingRect.width / this.viewportTransform[0];
            let horizontalInTheRange = false;
            let verticalInTheRange = false;
            const { _currentTransform: transform } = this.canvas;
            if (!transform) return;

            // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
            // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

            for (let i = canvasObjects.length; i--;) {
                if (canvasObjects[i] === target
                    || canvasObjects[i].superType === 'port'
                    || canvasObjects[i].superType === 'link'
                    || !canvasObjects[i].evented) {
                    continue;
                }

                const objectCenter = canvasObjects[i].getCenterPoint();
                const objectLeft = objectCenter.x;
                const objectTop = objectCenter.y;
                const objectBoundingRect = canvasObjects[i].getBoundingRect();
                const objectHeight = objectBoundingRect.height / this.viewportTransform[3];
                const objectWidth = objectBoundingRect.width / this.viewportTransform[0];

                // snap by the horizontal center line
                if (this.guidelineHandlers.isInRange(objectLeft, activeObjectLeft)) {
                    verticalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const y1 = -5000;
                        const y2 = 5000;
                        this.verticalLines.push({
                            x: objectLeft,
                            y1,
                            y2,
                        });
                    } else {
                        this.verticalLines.push({
                            x: objectLeft,
                            y1: (objectTop < activeObjectTop)
                                ? (objectTop - (objectHeight / 2) - this.aligningLineOffset)
                                : (objectTop + (objectHeight / 2) + this.aligningLineOffset),
                            y2: (activeObjectTop > objectTop)
                                ? (activeObjectTop + (activeObjectHeight / 2) + this.aligningLineOffset)
                                : (activeObjectTop - (activeObjectHeight / 2) - this.aligningLineOffset),
                        });
                    }
                    target.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
                }

                // snap by the left edge
                if (this.guidelineHandlers.isInRange(objectLeft - (objectWidth / 2), activeObjectLeft - (activeObjectWidth / 2))) {
                    verticalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const y1 = -5000;
                        const y2 = 5000;
                        let x = objectLeft - (objectWidth / 2);
                        if (canvasObjects[i].layout === 'fullscreen') {
                            x = 0;
                        }
                        this.verticalLines.push({
                            x,
                            y1,
                            y2,
                        });
                    } else {
                        this.verticalLines.push({
                            x: objectLeft - (objectWidth / 2),
                            y1: (objectTop < activeObjectTop)
                                ? (objectTop - (objectHeight / 2) - this.aligningLineOffset)
                                : (objectTop + (objectHeight / 2) + this.aligningLineOffset),
                            y2: (activeObjectTop > objectTop)
                                ? (activeObjectTop + (activeObjectHeight / 2) + this.aligningLineOffset)
                                : (activeObjectTop - (activeObjectHeight / 2) - this.aligningLineOffset),
                        });
                    }
                    target.setPositionByOrigin(new fabric.Point(objectLeft - (objectWidth / 2) + (activeObjectWidth / 2), activeObjectTop), 'center', 'center');
                }

                // snap by the right edge
                if (this.guidelineHandlers.isInRange(objectLeft + (objectWidth / 2), activeObjectLeft + (activeObjectWidth / 2))) {
                    verticalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const y1 = -5000;
                        const y2 = 5000;
                        let x = objectLeft + (objectWidth / 2);
                        if (canvasObjects[i].layout === 'fullscreen') {
                            x = this.canvas.getWidth();
                        }
                        this.verticalLines.push({
                            x,
                            y1,
                            y2,
                        });
                    } else {
                        this.verticalLines.push({
                            x: objectLeft + (objectWidth / 2),
                            y1: (objectTop < activeObjectTop)
                                ? (objectTop - (objectHeight / 2) - this.aligningLineOffset)
                                : (objectTop + (objectHeight / 2) + this.aligningLineOffset),
                            y2: (activeObjectTop > objectTop)
                                ? (activeObjectTop + (activeObjectHeight / 2) + this.aligningLineOffset)
                                : (activeObjectTop - (activeObjectHeight / 2) - this.aligningLineOffset),
                        });
                    }
                    target.setPositionByOrigin(new fabric.Point(objectLeft + (objectWidth / 2) - (activeObjectWidth / 2), activeObjectTop), 'center', 'center');
                }

                // snap by the vertical center line
                if (this.guidelineHandlers.isInRange(objectTop, activeObjectTop)) {
                    horizontalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const x1 = -5000;
                        const x2 = 5000;
                        this.horizontalLines.push({
                            y: objectTop,
                            x1,
                            x2,
                        });
                    } else {
                        this.horizontalLines.push({
                            y: objectTop,
                            x1: (objectLeft < activeObjectLeft)
                                ? (objectLeft - (objectWidth / 2) - this.aligningLineOffset)
                                : (objectLeft + (objectWidth / 2) + this.aligningLineOffset),
                            x2: (activeObjectLeft > objectLeft)
                                ? (activeObjectLeft + (activeObjectWidth / 2) + this.aligningLineOffset)
                                : (activeObjectLeft - (activeObjectWidth / 2) - this.aligningLineOffset),
                        });
                    }
                    target.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
                }

                // snap by the top edge
                if (this.guidelineHandlers.isInRange(objectTop - (objectHeight / 2), activeObjectTop - (activeObjectHeight / 2))) {
                    horizontalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const x1 = -5000;
                        const x2 = 5000;
                        let y = objectTop - (objectHeight / 2);
                        if (canvasObjects[i].layout === 'fullscreen') {
                            y = 0;
                        }
                        this.horizontalLines.push({
                            y,
                            x1,
                            x2,
                        });
                    } else {
                        this.horizontalLines.push({
                            y: objectTop - (objectHeight / 2),
                            x1: (objectLeft < activeObjectLeft)
                                ? (objectLeft - (objectWidth / 2) - this.aligningLineOffset)
                                : (objectLeft + (objectWidth / 2) + this.aligningLineOffset),
                            x2: (activeObjectLeft > objectLeft)
                                ? (activeObjectLeft + (activeObjectWidth / 2) + this.aligningLineOffset)
                                : (activeObjectLeft - (activeObjectWidth / 2) - this.aligningLineOffset),
                        });
                    }
                    target.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - (objectHeight / 2) + (activeObjectHeight / 2)), 'center', 'center');
                }

                // snap by the bottom edge
                if (this.guidelineHandlers.isInRange(objectTop + (objectHeight / 2), activeObjectTop + (activeObjectHeight / 2))) {
                    horizontalInTheRange = true;
                    if (canvasObjects[i].id === 'workarea') {
                        const x1 = -5000;
                        const x2 = 5000;
                        let y = objectTop + (objectHeight / 2);
                        if (canvasObjects[i].layout === 'fullscreen') {
                            y = this.canvas.getHeight();
                        }
                        this.horizontalLines.push({
                            y,
                            x1,
                            x2,
                        });
                    } else {
                        this.horizontalLines.push({
                            y: objectTop + (objectHeight / 2),
                            x1: (objectLeft < activeObjectLeft)
                                ? (objectLeft - (objectWidth / 2) - this.aligningLineOffset)
                                : (objectLeft + (objectWidth / 2) + this.aligningLineOffset),
                            x2: (activeObjectLeft > objectLeft)
                                ? (activeObjectLeft + (activeObjectWidth / 2) + this.aligningLineOffset)
                                : (activeObjectLeft - (activeObjectWidth / 2) - this.aligningLineOffset),
                        });
                    }
                    target.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + (objectHeight / 2) - (activeObjectHeight / 2)), 'center', 'center');
                }
            }

            if (!horizontalInTheRange) {
                this.horizontalLines.length = 0;
            }

            if (!verticalInTheRange) {
                this.verticalLines.length = 0;
            }
        },
        scalingGuidelines: (target) => {
            // TODO...
        },
    }

    render() {
        const { id } = this.state;
        return (
            <div
                ref={this.container}
                id="rde-canvas"
                className="rde-canvas"
                style={{ width: '100%', height: '100%' }}
            >
                <canvas id={`canvas_${id}`} />
            </div>
        );
    }
}

export default Canvas;
