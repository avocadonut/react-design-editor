declare namespace Canvas {
    type LayoutType = 'fixed' | 'responsive' | 'fullscreen';
    
    interface ILinkProperty {
        enabled?: boolean;
    }
    
    interface ITooltipProperty {
        enabled?: boolean;
    }

    interface ICanvasOption extends fabric.ICanvasOptions {
        width?: number;
        height?: number;
    }
    
    interface IWorkareaOption extends fabric.IImageOptions {
        id?: string;
        layout?: LayoutType;
        workareaWidth?: number;
        workareaHeight?: number;
    }
    
    interface IKeyboardEvent {
        move?: boolean;
        all?: boolean;
        copy?: boolean;
        paste?: boolean;
        esc?: boolean;
        del?: boolean;
    }
    
    interface ICanvasProps {
        fabricObjects?: object;
        editable?: boolean;
        canvasOption?: ICanvasOption;
        defaultOptions?: object;
        activeSelection?: object;
        zoomEnabled?: boolean;
        minZoom?: number;
        maxZoom?: number;
        propertiesToInclude?: string[];
        guidelineOption?: object;
        workareaOption?: IWorkareaOption;
        gridOption?: object;
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
}

export = Canvas;
export as namespace Canvas;