import { ITools } from './Tools';
import { IStaticCanvas } from '../Canvas';

export interface IAlignmentTools extends ITools {
    left(): void;
    center(): void;
    right(): void;
}

class AlignmentTools implements IAlignmentTools {
    canvas: IStaticCanvas;

    constructor(canvas: IStaticCanvas) {
        this.canvas = canvas;
    }

    left() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            const activeObjectLeft = -(activeObject.width / 2);
            activeObject.forEachObject((obj: any) => {
                obj.set({
                    left: activeObjectLeft,
                });
                obj.setCoords();
                this.canvas.renderAll();
            });
        }
    }

    center() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            activeObject.forEachObject((obj: any) => {
                obj.set({
                    left: 0 - ((obj.width * obj.scaleX) / 2),
                });
                obj.setCoords();
                this.canvas.renderAll();
            });
        }
    }

    right() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            const activeObjectLeft = (activeObject.width / 2);
            activeObject.forEachObject((obj: any) => {
                obj.set({
                    left: activeObjectLeft - (obj.width * obj.scaleX),
                });
                obj.setCoords();
                this.canvas.renderAll();
            });
        }
    }
}

export default AlignmentTools;
