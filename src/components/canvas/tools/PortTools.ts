import Tools, { ITools } from './Tools';

export interface IPortTools extends ITools {
    createPort?(target: any): void;
    setCoords?(target: any): void;
    recreatePort?(target: any): void;
}

class PortTools extends Tools implements IPortTools {
    createPort = (target: any) => {
        if (!target.createToPort) {
            return;
        }
        const toPort = target.createToPort(target.left + (target.width / 2), target.top);
        if (toPort) {
            toPort.on('mouseover', () => {
                if (this.canvas.interactionMode === 'link' && this.canvas.linkTools.activeLine && this.canvas.linkTools.activeLine.class === 'line') {
                    if (toPort.links.some(link => link.fromNode.id ===  this.canvas.linkTools.activeLine.fromNode)) {
                        toPort.set({
                            fill: toPort.errorFill,
                        });
                        this.canvas.renderAll();
                        return;
                    }
                    toPort.set({
                        fill: toPort.hoverFill,
                    });
                    this.canvas.renderAll();
                }
            });
            toPort.on('mouseout', () => {
                toPort.set({
                    fill: toPort.originFill,
                });
                this.canvas.renderAll();
            });
            this.canvas.add(toPort);
            toPort.setCoords();
            this.canvas.bringToFront(toPort);
        }
        const fromPort = target.createFromPort(target.left + (target.width / 2), target.top + target.height);
        if (fromPort && fromPort.length) {
            fromPort.forEach((port) => {
                if (port) {
                    port.on('mouseover', () => {
                        if (port.enabled) {
                            if (this.canvas.linkTools.activeLine) {
                                port.set({
                                    fill: port.errorFill,
                                });
                                this.canvas.renderAll();
                                return;
                            }
                            port.set({
                                fill: port.hoverFill,
                            });
                            this.canvas.renderAll();
                            return;
                        }
                        port.set({
                            fill: port.errorFill,
                        });
                        this.canvas.renderAll();
                    });
                    port.on('mouseout', () => {
                        port.set({
                            fill: port.originFill,
                        });
                        this.canvas.renderAll();
                    });
                    this.canvas.add(port);
                    port.setCoords();
                    this.canvas.bringToFront(port);
                }
            });
        }
    }

    setCoords = (target: any) => {
        if (target.toPort) {
            const toCoords = {
                left: target.left + (target.width / 2),
                top: target.top,
            };
            target.toPort.set({
                ...toCoords,
            });
            target.toPort.setCoords();
            if (target.toPort.links.length) {
                target.toPort.links.forEach((link) => {
                    const fromPort = link.fromNode.fromPort.filter(port => port.id === link.fromPort)[0];
                    this.canvas.linkTools.setCoords(fromPort.left, fromPort.top, toCoords.left, toCoords.top, link);
                });
            }
        }
        if (target.fromPort) {
            const fromCoords = {
                left: target.left + (target.width / 2),
                top: target.top + target.height,
            };
            target.fromPort.forEach((port) => {
                const left = port.leftDiff ? fromCoords.left + port.leftDiff : fromCoords.left;
                const top = port.topDiff ? fromCoords.top + port.topDiff : fromCoords.top;
                port.set({
                    left,
                    top,
                });
                port.setCoords();
                if (port.links.length) {
                    port.links.forEach((link) => {
                        this.canvas.linkTools.setCoords(left, top, link.toNode.toPort.left, link.toNode.toPort.top, link);
                    });
                }
            });
        }
    }

    recreatePort = (target: any) => {
        const { fromPort, toPort } = target;
        if (target.ports) {
            target.ports.forEach((port) => {
                target.removeWithUpdate(port);
                this.canvas.remove(port.fromPort);
            });
        }
        this.canvas.remove(target.toPort);
        if (target.toPort) {
            target.toPort.links.forEach((link) => {
                this.canvas.linkTools.remove(link, 'from');
            });
        }
        if (target.fromPort) {
            target.fromPort.forEach((port) => {
                if (port.links.length) {
                    port.links.forEach((link) => {
                        this.canvas.linkTools.remove(link, 'to');
                    });
                }
            });
        }
        this.createPort(target);
        toPort.links.forEach((link) => {
            link.fromNode = link.fromNode.id;
            link.toNode = target.toPort.nodeId;
            this.canvas.linkTools.create(link);
        });
        fromPort.filter(op => target.fromPort.some(np => np.id === op.id)).forEach((port) => {
            port.links.forEach((link) => {
                if (link.fromPort === port.id) {
                    link.fromNode = port.nodeId;
                    link.toNode = link.toNode.id;
                    this.canvas.linkTools.create(link);
                    this.setCoords(target);
                }
            });
        });
    }
}

export default PortTools;
