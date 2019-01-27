import Tools, { ITools } from './Tools';

export interface INodeTools extends ITools {

}

class NodeTools extends Tools implements INodeTools {

}

export default NodeTools;
