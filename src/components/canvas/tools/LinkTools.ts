import Tools, { ITools } from './Tools';
import { IStaticObject, IStaticLine } from '../Canvas';
import OrthogonalLink from '../../workflow/link/OrthogonalLink';
import CurvedLink from '../../workflow/link/CurvedLink';

export interface ILinkException {
    alreadyConnect?(target: any): void;
    duplicate?(target: any): void;
    alreadyDrawing?(): void;
}

export interface ILinkTools extends ITools {
    activeLine?: IStaticLine;
    exception?: ILinkException;
    init?(target: IStaticObject): void;
    finish?(): void;
    generate?(target: any): void;
    create?(link: any, init?: boolean): void;
    setCoords?(x1: number, y1: number, x2: number, y2: number, link: any): void;
    removeFrom?(link: any): void;
    removeTo?(link: any): void;
    removeAll?(link: any): void;
    remove?(link: any, type: string): void;
}

class LinkTools extends Tools implements ILinkTools {
    activeLine: IStaticLine;

    init = (target: any) => {
        if (!target.enabled) {
            console.warn('이미 연결된 노드가 존재 합니다.');
            return;
        }
        this.canvas.interactionMode = 'link';
        const { left, top } = target;
        // const points = [left, top, left, top];
        const fromPort = { left, top };
        const toPort = { left, top };
        this.activeLine = new CurvedLink(target.nodeId, fromPort, null, toPort, {
            strokeWidth: 2,
            fill: '#999999',
            stroke: '#999999',
            class: 'line',
            originX: 'center',
            originY: 'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            fromNode: target.nodeId,
            fromPort: target.id,
        });
        this.canvas.add(this.activeLine);
    }

    finish = () => {
        this.canvas.interactionMode = 'selection';
        this.canvas.remove(this.activeLine);
        this.activeLine = null;
        this.canvas.renderAll();
    }

    generate = (target: any) => {
        if (target.nodeId === this.activeLine.fromNode) {
            console.warn('같은 노드를 선택할 수 없습니다.');
            return;
        }
        const link = {
            type: 'CurvedLink',
            fromNode: this.activeLine.fromNode,
            fromPort: this.activeLine.fromPort,
            toNode: target.nodeId,
            toPort: target.id,
        };
        this.create(link, true);
        this.finish();
    }

    create = (link: any, init = false) => {
        const fromNode = this.canvas.generalTools.findById(link.fromNode);
        const fromPort = fromNode.fromPort.filter(port => port.id === link.fromPort || !port.id)[0];
        const toNode = this.canvas.generalTools.findById(link.toNode);
        const { toPort } = toNode;
        const createdObj = this.fabricObjects[link.type].create(fromNode, fromPort, toNode, toPort, { ...link });
        this.canvas.add(createdObj);
        this.objects.push(createdObj);
        const { onAdd } = this;
        if (onAdd && this.editable && init) {
            onAdd(createdObj);
        }
        this.canvas.renderAll();
        createdObj.setPort(fromNode, fromPort, toNode, toPort);
        this.canvas.portTools.setCoords(fromNode);
        this.canvas.portTools.setCoords(toNode);
        return createdObj;
    }

    setCoords = (x1: number, y1: number, x2: number, y2: number, link: any) => {
        link.set({
            x1,
            y1,
            x2,
            y2,
        });
        link.setCoords();
    }

    removeFrom = (link: any) => {
        if (link.fromNode.fromPort.length) {
            let index = -1;
            link.fromNode.fromPort.forEach((port) => {
                if (port.links.length) {
                    port.links.some((portLink, i) => {
                        if (link.id === portLink.id) {
                            index = i;
                            return true;
                        }
                        return false;
                    });
                    if (index > -1) {
                        port.links.splice(index, 1);
                    }
                }
                link.setPortEnabled(link.fromNode, port, true);
            });
        }
    }

    removeTo = (link: any) => {
        if (link.toNode.toPort.links.length) {
            let index = -1;
            link.toNode.toPort.links.some((portLink, i) => {
                if (link.id === portLink.id) {
                    index = i;
                    return true;
                }
                return false;
            });
            if (index > -1) {
                link.toNode.toPort.links.splice(index, 1);
            }
            link.setPortEnabled(link.toNode, link.toNode.toPort, true);
        }
    }

    removeAll = (link: any) => {
        this.removeFrom(link);
        this.removeTo(link);
    }

    remove = (link: any, type: string) => {
        if (type === 'from') {
            this.removeFrom(link);
        } else if (type === 'to') {
            this.removeTo(link);
        } else {
            this.removeAll(link);
        }
        this.canvas.remove(link);
        this.canvas.generalTools.removeOriginById(link.id);
    }

    exception: ILinkException = {
        alreadyConnect: (target: any) => {
            if (!target.enabled) {
                console.warn('이미 연결된 노드가 존재 합니다.');
                return null;
            }
        },
        duplicate: (target: any) => {
            if (target.links.some(link => link.fromNode.id === this.activeLine.fromNode)) {
                console.warn('중복된 연결을 할 수 없습니다.');
                return null;
            }
        },
        alreadyDrawing: () => {
            if (this.canvas.interactionMode === 'link' && this.activeLine) {
                console.warn('이미 링크를 그리는 중입니다.');
                return null;
            }
        },
    }
}

export default LinkTools;
