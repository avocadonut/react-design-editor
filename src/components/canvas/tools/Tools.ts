import { IStaticCanvas } from '../Canvas';

export interface ITools {
    canvas: IStaticCanvas;
}

export default class Tools {
    canvas: IStaticCanvas;

    constructor(canvas: IStaticCanvas) {
        this.canvas = canvas;
    }
}
