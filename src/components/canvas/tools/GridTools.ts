import { fabric } from 'fabric';

import Tools, { ITools } from './Tools';

export interface IGridTools extends ITools {
    init(): void;
    setCoords(target: fabric.Object): void;
}

class GridTools extends Tools implements IGridTools {
    constructor(toolOption: ITools) {
        super(toolOption);
        this.init();
    }

    init() {
        const { gridOption } = this;
        if (gridOption.enabled && gridOption.grid) {
            const width = 5000;
            const gridLength = width / gridOption.grid;
            const lineOptions = {
                stroke: '#ebebeb',
                // strokeWidth: 1,
                selectable: false,
                evented: false,
                id: 'grid',
            };
            for (let i = 0; i < gridLength; i++) {
                const distance = i * gridOption.grid;
                const fhorizontal = new fabric.Line([distance, -width, distance, width], lineOptions);
                const shorizontal = new fabric.Line([distance - width, -width, distance - width, width], lineOptions);
                this.canvas.add(fhorizontal);
                this.canvas.add(shorizontal);
                const fvertical = new fabric.Line([-width, distance - width, width, distance - width], lineOptions);
                const svertical = new fabric.Line([-width, distance, width, distance], lineOptions);
                this.canvas.add(fvertical);
                this.canvas.add(svertical);
                if (i % 5 === 0) {
                    fhorizontal.set({ stroke: '#cccccc' });
                    shorizontal.set({ stroke: '#cccccc' });
                    fvertical.set({ stroke: '#cccccc', top: fvertical.top + 10 });
                    svertical.set({ stroke: '#cccccc', top: svertical.top + 10 });
                } else {
                    fvertical.set({ top: fvertical.top + 10 });
                    svertical.set({ top: svertical.top + 10 });
                }
            }
        }
    }

    setCoords(target: fabric.Object) {
        const { gridOption: { enabled, grid, snapToGrid } } = this;
        if (enabled && grid && snapToGrid) {
            target.set({
                left: Math.round(target.left / grid) * grid,
                top: Math.round(target.top / grid) * grid,
            });
            target.setCoords();
            this.canvas.portTools.setCoords(target);
        }
    }
}

export default GridTools;
