import React, { Component } from 'react';
import { fabric } from 'fabric';
import uuid from 'uuid/v4';
import anime, { AnimeInstance } from 'animejs';

import CanvasObjects from './CanvasObjects';

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
    _currentTransform?: any;
    contextTop?: any;
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
export interface IStaticCircle extends fabric.Circle {
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
export type IStaticLine = IStaticObject & fabric.Line;
export interface IStaticPolygon extends fabric.Polygon {
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
        if (editable) {
            this.canvas.interactionMode = 'selection';
            this.canvas.editable = editable;
            this.canvas.panning = false;
            if (guidelineOption.enabled) {
                this.canvas.guidelineTools.init();
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
                'before:render': guidelineOption.enabled ? beforeRender : null,
                'after:render': guidelineOption.enabled ? afterRender : null,
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
            onAdd,
            onRemove,
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
            onAdd,
            onRemove,
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
        this.canvas.workareaTools = new WorkareaTools(defaultToolOption);
        this.canvas.guidelineTools = new GuidelineTools(defaultToolOption);
        this.canvas.drawingTools = new DrawingTools(defaultToolOption);
        this.canvas.eventTools = new EventTools(defaultToolOption, this.keyEvent);
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
