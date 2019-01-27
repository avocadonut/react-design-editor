import { ITools } from './Tools';

export interface IGeneralTools extends ITools {

}

class GeneralTools {
    constructor(canvas) {
        this.canvas = canvas;
    }
}

export default GeneralTools;
