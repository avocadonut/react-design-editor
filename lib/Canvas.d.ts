import React, { Component } from 'react';
import { fabric } from 'fabric';
import 'mediaelement';
import 'mediaelement/build/mediaelementplayer.min.css';
import interact from 'interactjs';
import anime from 'animejs';
import '../../styles/core/tooltip.less';
import '../../styles/core/contextmenu.less';
export interface ICanvasOption extends fabric.ICanvasOptions {
    width?: number;
    height?: number;
}
export declare type LayoutType = 'fixed' | 'responsive' | 'fullscreen';
export interface ILinkProperty {
    enabled?: boolean;
}
export interface ITooltipProperty {
    enabled?: boolean;
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
export interface ICanvasProps {
    fabricObjects?: object;
    editable?: boolean;
    canvasOption?: ICanvasOption;
    defaultOptions?: object;
    activeSelection?: object;
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
    onTooltip?(tooltipRef: HTMLDivElement, target: fabric.Object): HTMLElement | string;
    onContext?: (contextmenuRef: HTMLDivElement, e: React.MouseEvent, target: fabric.Object) => HTMLElement | string;
    onLink?(canvas: fabric.Canvas, target: fabric.Object): void;
    keyEvent?: IKeyboardEvent;
}
declare class Canvas extends Component<ICanvasProps> {
    static defaultProps: ICanvasProps;
    constructor(props: ICanvasProps);
    state: {
        id: string;
        clipboard: null;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    attachEventListener: () => void;
    detachEventListener: () => void;
    handlers: {
        centerObject: (obj: any, centered: any) => void;
        add: (obj: any, centered?: boolean, loaded?: boolean) => any;
        addGroup: (obj: any, centered?: boolean, loaded?: boolean) => any;
        addImage: (obj: any, centered?: boolean, loaded?: boolean) => void;
        addElement: (obj: any, centered?: boolean, loaded?: boolean) => void;
        remove: () => false | undefined;
        removeById: (id: any) => void;
        duplicate: () => false | undefined;
        duplicateById: (id: any) => void;
        copy: () => false | undefined;
        paste: () => false | undefined;
        set: (key: any, value: any) => false | undefined;
        setObject: (option: any) => false | undefined;
        setByObject: (obj: any, key: any, value: any) => void;
        setById: (id: any, key: any, value: any) => void;
        setShadow: (key: any, value: any) => false | undefined;
        loadImage: (obj: any, src: any) => void;
        setImage: (obj: any, src: any) => void;
        setImageById: (id: any, source: any) => void;
        find: (obj: any) => any;
        findById: (id: any) => any;
        allSelect: () => void;
        select: (obj: any) => void;
        selectById: (id: any) => void;
        originScaleToResize: (obj: any, width: any, height: any) => void;
        scaleToResize: (width: any, height: any) => void;
        importJSON: (json: any, callback: any) => void;
        exportJSON: () => any;
        getObjects: () => any;
        bringForward: () => void;
        bringToFront: () => void;
        sendBackwards: () => void;
        sendToBack: () => void;
        clear: (workarea?: boolean) => void;
        toGroup: () => void;
        toActiveSelection: () => void;
        isElementType: (type: any) => boolean;
        getOriginObjects: () => any;
        findOriginById: (id: any) => any;
        findOriginByIdWithIndex: (id: any) => any;
        removeOriginById: (id: any) => void;
    };
    cropHandlers: {
        validType: () => boolean;
        start: () => void;
        finish: () => void;
        cancel: () => void;
        resize: (opt: any) => void;
        moving: (opt: any) => void;
    };
    modeHandlers: {
        selection: (callback: any) => void;
        grab: (callback: any) => void;
        drawing: (callback: any) => void;
        moving: (e: any) => void;
    };
    animationHandlers: {
        play: (id: any, hasControls: any) => void;
        pause: (id: any) => void;
        stop: (id: any, hasControls?: boolean) => void;
        restart: (id: any) => void;
        initAnimation: (obj: any, hasControls?: boolean) => void;
        getAnimation: (obj: any, hasControls: any) => anime.AnimeInstance | undefined;
    };
    videoHandlers: {
        play: () => void;
        pause: () => void;
        stop: () => void;
        create: (obj: any, src: any) => void;
        load: (obj: any, src: any) => void;
        set: (obj: any, src: any) => void;
    };
    elementHandlers: {
        setById: (id: any, source: any) => void;
        set: (obj: any, source: any) => void;
        createElement: (obj: any, code: any) => void;
        createIFrame: (obj: any, src: any) => void;
        findScriptById: (id: any) => HTMLElement | null;
        findStyleById: (id: any) => HTMLElement | null;
        findById: (id: any) => HTMLElement | null;
        remove: (el: any) => void;
        removeStyleById: (id: any) => void;
        removeScriptById: (id: any) => void;
        removeById: (id: any) => void;
        removeByIds: (ids: any) => void;
        setPosition: (el: any, left: any, top: any) => any;
        setSize: (el: any, width: any, height: any) => any;
        setScale: (el: any, x: any, y: any) => any;
        setZoom: (el: any, zoom: any) => any;
        draggable: (el: any, obj: any) => false | interact.Interactable;
    };
    workareaHandlers: {
        setLayout: (value: any) => void;
        setResponsiveImage: (src: any, loaded: any) => void;
        setImage: (src: any, loaded?: boolean) => void;
    };
    nodeHandlers: {
        selectByPath: (path: any) => void;
        selectById: (id: any) => void;
        deselect: () => void;
        highlightingByPath: (path: any) => void;
        highlightingLink: (object: any, targetObject: any, duration?: number) => void;
        highlightingNode: (object: any, duration?: number) => void;
    };
    portHandlers: {
        createPort: (target: any) => void;
        setCoords: (target: any) => void;
        recreatePort: (target: any) => void;
    };
    linkHandlers: {
        init: (target: any) => void;
        finish: () => void;
        generate: (target: any) => void;
        create: (link: any, init?: boolean) => any;
        setCoords: (x1: any, y1: any, x2: any, y2: any, link: any) => void;
        removeFrom: (link: any) => void;
        removeTo: (link: any) => void;
        removeAll: (link: any) => void;
        remove: (link: any, type: any) => void;
        exception: {
            alreadyConnect: (target: any) => void;
            duplicate: (target: any) => void;
            alreadyDrawing: () => void;
        };
    };
    drawingHandlers: {
        polygon: {
            initDraw: () => void;
            finishDraw: () => void;
            addPoint: (opt: any) => void;
            generatePolygon: (pointArray: any) => void;
            createResize: (target: any, points: any) => void;
            removeResize: () => void;
            movingResize: (target: any, e: any) => void;
        };
        line: {};
    };
    alignmentHandlers: {
        left: () => void;
        center: () => void;
        right: () => void;
    };
    zoomHandlers: {
        zoomToPoint: (point: any, zoom: any) => void;
        zoomOneToOne: () => void;
        zoomToFit: () => void;
        zoomIn: () => void;
        zoomOut: () => void;
    };
    tooltipHandlers: {
        show: ((target: any) => Promise<void>) & import("lodash").Cancelable;
        hide: ((target: any) => void) & import("lodash").Cancelable;
    };
    contextmenuHandlers: {
        show: ((e: any, target: any) => Promise<void>) & import("lodash").Cancelable;
        hide: ((target: any) => void) & import("lodash").Cancelable;
    };
    guidelineHandlers: {
        init: () => void;
        drawVerticalLine: (coords: any) => void;
        drawHorizontalLine: (coords: any) => void;
        drawLine: (x1: any, y1: any, x2: any, y2: any) => void;
        isInRange: (v1: any, v2: any) => boolean;
        movingGuidelines: (target: any) => void;
        scalingGuidelines: (target: any) => void;
    };
    gridHandlers: {
        init: () => void;
        setCoords: (target: any) => void;
    };
    eventHandlers: {
        object: {
            mousedown: (opt: any) => void;
        };
        modified: (opt: any) => void;
        moving: (opt: any) => void;
        moved: (opt: any) => void;
        scaling: (opt: any) => void;
        rotating: (opt: any) => void;
        arrowmoving: (e: any) => false | undefined;
        mousewheel: (opt: any) => void;
        mousedown: (opt: any) => void;
        mousemove: (opt: any) => false | undefined;
        mouseup: (opt: any) => void;
        mouseout: (opt: any) => void;
        selection: (opt: any) => void;
        beforeRender: (opt: any) => void;
        afterRender: (opt: any) => void;
        resize: (currentWidth: any, currentHeight: any, nextWidth: any, nextHeight: any) => void;
        paste: (e: any) => false | undefined;
        keydown: (e: any) => false | undefined;
        contextmenu: (e: any) => void;
        onmousedown: (e: any) => void;
    };
    render(): JSX.Element;
}
export default Canvas;
