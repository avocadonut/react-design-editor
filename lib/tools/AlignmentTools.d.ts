export interface IAlignmentTools {
    canvas: any;
    left(): void;
    center(): void;
    right(): void;
}
declare class AlignmentTools implements IAlignmentTools {
    canvas: any;
    constructor(canvas: fabric.Canvas);
    left(): void;
    center(): void;
    right(): void;
}
export default AlignmentTools;
