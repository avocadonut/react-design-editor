import { fabric } from 'fabric';
import interact from 'interactjs';

import { ITools } from './Tools';
import { IStaticObject, IStaticCanvas } from '../Canvas';

export interface ICodeProperty {
    html?: string;
    css?: string;
    js?: string;
}

export interface IElementTools extends ITools {
    set?(obj: IStaticObject, code: ICodeProperty): void;
    setById?(id: string, code: ICodeProperty): void;
    createElement?(obj: IStaticObject, code: ICodeProperty): void;
    createIFrame?(obj: IStaticObject, src: string): void;
    findById?(id: string): HTMLElement | null;
    findScriptById?(id: string): HTMLScriptElement | null;
    findStyleById?(id: string): HTMLStyleElement | null;
    remove?(el: HTMLElement): void;
    removeById?(id: string): void;
    removeStyleById?(id: string): void;
    removeScriptById?(id: string): void;
    removeByIds?(ids: string[]): void;
    setPosition?(el: HTMLElement, left: number, top: number): HTMLElement | null;
    setSize?(el: HTMLElement, width: number, height: number): HTMLElement | null;
    setScale?(el: HTMLElement, scaleX: number, scaleY: number): HTMLElement | null;
    setZoom?(el: HTMLElement, zoom: number): HTMLElement | null;
    draggable?(el: HTMLElement | string, obj: IStaticObject): interact.Interactable | null;
}

class ElementTools implements IElementTools {
    canvas: IStaticCanvas;
    container: React.RefObject<HTMLDivElement>;
    onSelect?: any;

    constructor(canvas: IStaticCanvas, container?: React.RefObject<HTMLDivElement>, onSelect?: any) {
        this.canvas = canvas;
        this.container = container;
        this.onSelect = onSelect;
    }

    set(obj: IStaticObject, code: any) {
        if (obj.type === 'iframe') {
            this.createIFrame(obj, code);
        } else {
            this.createElement(obj, code);
        }
    }

    setById(id: string, code: ICodeProperty) {
        const findObject = this.canvas.generalTools.findById(id);
        if (!findObject) {
            return;
        }
        if (findObject.type === 'video') {
            this.canvas.videoTools.set(findObject, code);
        } else if (findObject.type === 'element') {
            this.set(findObject, code);
        } else if (findObject.type === 'iframe') {
            this.set(findObject, code);
        }
    }

    createElement(obj: IStaticObject, code: ICodeProperty) {
        obj.set('code', code);
        const { editable } = this.canvas;
        const { left, top } = obj.getBoundingRect();
        const { id, scaleX, scaleY, angle } = obj;
        if (editable) {
            this.removeById(id);
            this.removeStyleById(id);
            this.removeScriptById(id);
        }
        const zoom = this.canvas.getZoom();
        const width = obj.width * scaleX * zoom;
        const height = obj.height * scaleY * zoom;
        const element = fabric.util.makeElement('div', {
            id: `${id}_container`,
            style: `transform: rotate(${angle}deg);
                    width: ${width}px;
                    height: ${height}px;
                    left: ${left}px;
                    top: ${top}px;
                    position: absolute;`,
        });
        const { html, css, js } = code;
        if (code.css && code.css.length) {
            const styleElement = document.createElement('style');
            styleElement.id = `${id}_style`;
            styleElement.type = 'text/css';
            styleElement.innerHTML = css;
            document.head.appendChild(styleElement);
        }
        this.container.current.appendChild(element);
        if (code.js && code.js.length) {
            const script = document.createElement('script');
            script.id = `${id}_script`;
            script.type = 'text/javascript';
            script.innerHTML = js;
            element.appendChild(script);
        }
        element.innerHTML = html;
        if (editable) {
            this.draggable(element, obj);
            element.addEventListener('mousedown', (e) => {
                this.canvas.setActiveObject(obj);
                this.canvas.renderAll();
            }, false);
        }
        obj.setCoords();
    }

    createIFrame(obj: IStaticObject, src: string) {
        obj.set('src', src);
        const { editable } = this.canvas;
        const { id, scaleX, scaleY, angle } = obj;
        if (editable) {
            this.removeById(id);
        }
        const { left, top } = obj.getBoundingRect();
        const iframeElement = fabric.util.makeElement('iframe', {
            id,
            src,
            width: '100%',
            height: '100%',
        });
        const zoom = this.canvas.getZoom();
        const width = obj.width * scaleX * zoom;
        const height = obj.height * scaleY * zoom;
        const iframe = fabric.util.wrapElement(iframeElement, 'div', {
            id: `${id}_container`,
            style: `transform: rotate(${angle}deg);
                    width: ${width}px;
                    height: ${height}px;
                    left: ${left}px;
                    top: ${top}px;
                    position: absolute;
                    z-index: 100000;`,
        });
        this.container.current.appendChild(iframe);
        if (editable) {
            this.draggable(iframe, obj);
            iframe.addEventListener('mousedown', (e) => {
                this.canvas.setActiveObject(obj);
                this.canvas.renderAll();
            }, false);
        }
        obj.setCoords();
    }

    findById(id: string) {
        return document.getElementById(`${id}_container`);
    }

    findScriptById(id: string) {
        return document.getElementById(`${id}_script`) as HTMLScriptElement;
    }

    findStyleById(id: string) {
        return document.getElementById(`${id}_style`) as HTMLStyleElement;
    }

    remove(el: HTMLElement) {
        if (!el) {
            return;
        }
        this.container.current.removeChild(el);
    }

    removeById(id: string) {
        const el = this.findById(id);
        this.remove(el);
    }

    removeStyleById(id: string) {
        const style = this.findStyleById(id);
        if (!style) {
            return;
        }
        document.head.removeChild(style);
    }

    removeScriptById(id: string) {
        const script = this.findScriptById(id);
        if (!script) {
            return;
        }
        document.head.removeChild(script);
    }

    removeByIds(ids: string[]) {
        ids.forEach((id) => {
            this.removeById(id);
            this.removeStyleById(id);
            this.removeScriptById(id);
        });
    }

    setPosition(el: HTMLElement, left: number, top: number) {
        if (!el) {
            return null;
        }
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.transform = null;
        el.setAttribute('data-x', '0');
        el.setAttribute('data-y', '0');
        return el;
    }

    setSize(el: HTMLDivElement, width: number, height: number) {
        if (!el) {
            return null;
        }
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        return el;
    }

    setScale(el: HTMLDivElement, sacleX: number, scaleY: number) {
        if (!el) {
            return null;
        }
        el.style.transform = `scale(${sacleX}, ${scaleY})`;
        return el;
    }

    setZoom(el: HTMLDivElement, zoom: number) {
        if (!el) {
            return null;
        }
        el.style.zoom = `${zoom}`;
        return el;
    }

    draggable(el: HTMLElement | string, obj: IStaticObject) {
        if (!el) {
            return null;
        }
        return interact(el)
            .draggable({
                restrict: {
                    restriction: 'parent',
                    // elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                },
                onmove: (e) => {
                    const { dx, dy, target } = e;
                    // keep the dragged position in the data-x/data-y attributes
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + dy;
                    // translate the element
                    target.style.webkitTransform = `translate(${x}px, ${y}px)`;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    // update the posiion attributes
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                    // update canvas object the position
                    obj.set({
                        left: obj.left + dx,
                        top: obj.top + dy,
                    });
                    obj.setCoords();
                    this.canvas.renderAll();
                },
                onend: () => {
                    if (this.onSelect) {
                        this.onSelect(obj);
                    }
                },
            });
    }
}

export default ElementTools;
