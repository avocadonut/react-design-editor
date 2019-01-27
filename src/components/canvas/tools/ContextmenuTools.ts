import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';

import { IStaticObject } from '../Canvas';
import Tools, { ITools } from './Tools';

export interface IContextmenuTools extends ITools {
    contextmenuRef?: HTMLDivElement;
    create(): void;
    remove(): void;
    show(e?: MouseEvent, target?: IStaticObject): void;
    hide(target?: IStaticObject): void;
}

class ContextmenuTools extends Tools implements IContextmenuTools {
    contextmenuRef?: HTMLDivElement;

    create() {
        this.contextmenuRef = document.createElement('div');
        this.contextmenuRef.id = `${this.canvas.id}_contextmenu`;
        this.contextmenuRef.className = 'rde-contextmenu contextmenu-hidden';
        document.body.appendChild(this.contextmenuRef);
    }

    remove() {
        if (this.contextmenuRef) {
            document.body.removeChild(this.contextmenuRef);
        }
    }

    show = debounce(async (e: MouseEvent, target: IStaticObject) => {
        if (!this.onContext) {
            return;
        }
        while (this.contextmenuRef.hasChildNodes()) {
            this.contextmenuRef.removeChild(this.contextmenuRef.firstChild);
        }
        const contextmenu = document.createElement('div');
        contextmenu.className = 'rde-contextmenu-right';
        const element = await this.onContext(this.contextmenuRef, e, target);
        if (!element) {
            return;
        }
        // contextmenu.innerHTML = element;
        this.contextmenuRef.appendChild(contextmenu);
        ReactDOM.render(element, contextmenu);
        this.contextmenuRef.classList.remove('contextmenu-hidden');
        const { clientX: left, clientY: top } = e;
        this.contextmenuRef.style.left = `${left}px`;
        this.contextmenuRef.style.top = `${top}px`;
    }, 100);

    hide = debounce(async (target?: IStaticObject) => {
        this.contextmenuRef.classList.add('contextmenu-hidden');
    }, 100);
}

export default ContextmenuTools;
