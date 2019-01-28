import React from 'react';

import {
    IStaticCanvas,
    IStaticWorkarea,
    ICanvasOption,
    IWorkareaOption,
    IGuidelineOption,
    IGridOption,
    IStaticObject,
} from '../Canvas';

export interface ITools {
    canvas: IStaticCanvas;
    workarea?: IStaticWorkarea;
    editable?: boolean;
    canvasOption?: ICanvasOption;
    workareaOption?: IWorkareaOption;
    guidelineOption?: IGuidelineOption;
    gridOption?: IGridOption;
    container?: React.RefObject<HTMLDivElement>;
    objects?: IStaticObject[];
    fabricObjects?: any[];
    defaultOptions?: any;
    propertiesToInclude?: string[];
    activeSelection?: fabric.IObjectOptions;
    zoomEnabled?: boolean;
    onModified?(target: IStaticObject): void;
    onAdd?(target: IStaticObject): void;
    onRemove?(target: IStaticObject): void;
    onSelect?(target: IStaticObject): void;
    onZoom?(zoomRatio: number): void;
    onTooltip?(tooltipRef: HTMLDivElement, target: IStaticObject): React.DOMElement<React.DOMAttributes<Element>, Element>;
    onContext?: (contextmenuRef: HTMLDivElement, e: MouseEvent, target: IStaticObject) => React.DOMElement<React.DOMAttributes<Element>, Element>;
    onLink?(canvas: IStaticCanvas, target: IStaticObject): void;
}

export default class Tools {
    canvas: IStaticCanvas;
    workarea?: IStaticWorkarea;
    editable?: boolean;
    canvasOption?: ICanvasOption;
    workareaOption?: IWorkareaOption;
    guidelineOption?: IGuidelineOption;
    gridOption?: IGridOption;
    container?: React.RefObject<HTMLDivElement>;
    objects?: IStaticObject[];
    fabricObjects?: any[];
    defaultOptions?: any;
    propertiesToInclude?: string[];
    activeSelection?: fabric.IObjectOptions;
    zoomEnabled?: boolean;
    onModified?(target: IStaticObject): void;
    onAdd?(target: IStaticObject): void;
    onRemove?(target: IStaticObject): void;
    onSelect?(target: IStaticObject | fabric.Group | fabric.ActiveSelection): void;
    onZoom?(zoomRatio: number): void;
    onTooltip?(tooltipRef: HTMLDivElement, target: IStaticObject): React.DOMElement<React.DOMAttributes<Element>, Element>;
    onContext?(contextmenuRef: HTMLDivElement, e: MouseEvent, target: IStaticObject): React.DOMElement<React.DOMAttributes<Element>, Element>;
    onLink?(canvas: IStaticCanvas, target: IStaticObject): void;

    constructor(toolOption: ITools) {
        this.canvas = toolOption.canvas;
        this.workarea = toolOption.workarea;
        this.editable = toolOption.editable;
        this.canvasOption = toolOption.canvasOption;
        this.workareaOption = toolOption.workareaOption;
        this.guidelineOption = toolOption.guidelineOption;
        this.gridOption = toolOption.gridOption;
        this.container = toolOption.container;
        this.objects = toolOption.objects;
        this.fabricObjects = toolOption.fabricObjects;
        this.defaultOptions = toolOption.defaultOptions;
        this.propertiesToInclude = toolOption.propertiesToInclude;
        this.zoomEnabled = toolOption.zoomEnabled;
        this.onModified = toolOption.onModified;
        this.onAdd = toolOption.onAdd;
        this.onRemove = toolOption.onRemove;
        this.onSelect = toolOption.onSelect;
        this.onZoom = toolOption.onZoom;
        this.onTooltip = toolOption.onTooltip;
        this.onContext = toolOption.onContext;
        this.onLink = toolOption.onLink;
    }
}
