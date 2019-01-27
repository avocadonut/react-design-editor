import Tools, { ITools } from './Tools';

export interface IAlignmentTools extends ITools {
    left(): void;
    center(): void;
    right(): void;
}

class AlignmentTools extends Tools implements IAlignmentTools {
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
