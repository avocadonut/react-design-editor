import Tools, { ITools } from './Tools';

export interface IDrawingTools extends ITools {

}

class DrawingTools extends Tools implements IDrawingTools {

}

export default DrawingTools;
