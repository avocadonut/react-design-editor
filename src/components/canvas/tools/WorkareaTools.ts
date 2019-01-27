import Tools, { ITools } from './Tools';

export interface IWorkareaTools extends ITools {

}

class WorkareaTools extends Tools implements IWorkareaTools {

}

export default WorkareaTools;
