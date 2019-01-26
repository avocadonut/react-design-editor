export interface IAlignmentTools {
    canvas: any;
    left(): void;
    center(): void;
    right(): void;
}

class AlignmentTools implements IAlignmentTools {
    canvas: any;

    constructor(canvas: fabric.Canvas) {
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
