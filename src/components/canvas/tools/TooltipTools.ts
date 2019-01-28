import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';

import Tools, { ITools } from './Tools';
import { IStaticObject } from '../Canvas';

export interface ITooltipTools extends ITools {
    target?: IStaticObject;
    tooltipRef?: HTMLDivElement;
    create(): void;
    remove(): void;
    show(target: IStaticObject): void;
    hide(target?: IStaticObject): void;
}

class TooltipTools extends Tools implements ITooltipTools {
    target?: IStaticObject;
    tooltipRef?: HTMLDivElement;

    create() {
        this.tooltipRef = document.createElement('div');
        this.tooltipRef.id = `${this.canvas.id}_tooltip`;
        this.tooltipRef.className = 'rde-tooltip tooltip-hidden';
        document.body.appendChild(this.tooltipRef);
    }

    remove() {
        if (this.tooltipRef) {
            document.body.removeChild(this.tooltipRef);
        }
    }

    show = debounce(async (target: IStaticObject) => {
        if (target.tooltip && target.tooltip.enabled) {
            if (!this.onTooltip) {
                return;
            }
            while (this.tooltipRef.hasChildNodes()) {
                this.tooltipRef.removeChild(this.tooltipRef.firstChild);
            }
            const tooltip = document.createElement('div');
            tooltip.className = 'rde-tooltip-right';
            const element = await this.onTooltip(this.tooltipRef, target);
            if (!element) {
                return;
            }
            this.tooltipRef.appendChild(tooltip);
            ReactDOM.render(element, tooltip);
            this.tooltipRef.classList.remove('tooltip-hidden');
            const zoom = this.canvas.getZoom();
            const { clientHeight } = this.tooltipRef;
            const { width, height, scaleX, scaleY } = target;
            const { left, top } = target.getBoundingRect();
            const { _offset: offset } = this.canvas.calcOffset();
            const objWidthDiff = (width * scaleX) * zoom;
            const objHeightDiff = (((height * scaleY) * zoom) / 2) - (clientHeight / 2);
            const calcLeft = offset.left + left + objWidthDiff;
            const calcTop = offset.top + top + objHeightDiff;
            if (document.body.clientWidth <= (calcLeft + this.tooltipRef.offsetWidth)) {
                this.tooltipRef.style.left = `${left + offset.left - this.tooltipRef.offsetWidth}px`;
                tooltip.className = 'rde-tooltip-left';
            } else {
                this.tooltipRef.style.left = `${calcLeft}px`;
            }
            this.tooltipRef.style.top = `${calcTop}px`;
            this.target = target;
        }
    }, 100);

    hide = debounce((target?: IStaticObject) => {
        this.target = null;
        if (this.tooltipRef && this.tooltipRef.classList) {
            this.tooltipRef.classList.add('tooltip-hidden');
        }
    }, 100);
}

export default TooltipTools;
