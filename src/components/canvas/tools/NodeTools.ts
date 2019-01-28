import { fabric } from 'fabric';

import Tools, { ITools } from './Tools';

export interface INodeTools extends ITools {
    selectByPath?(path: string[]): void;
    selectById?(id: string): void;
    deselect?(): void;
    highlightingByPath?(path: string[]): void;
    highlightingLink?(object: any, targetObject: any, duration: number): void;
    highlightingNode?(object: any, duration: number): void;
}

class NodeTools extends Tools implements INodeTools {
    selectByPath = (path: string[]) => {
        if (!path || !path.length) {
            return;
        }
        const splitPath = path.reduce((prev, curr, index) => {
            if (!path[index + 1]) {
                return prev;
            }
            const newPath = [path[index], path[index + 1]];
            prev.push(newPath);
            return prev;
        }, []);
        const targetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id === object.id));
        const nonTargetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id !== object.id));
        nonTargetObjects.forEach((object) => {
            if (object.superType === 'link') {
                const { fromNode, toNode } = object;
                if (splitPath.some(findPath => fromNode.id === findPath[0] && toNode.id === findPath[1])) {
                    object.set({
                        opacity: 1,
                    });
                    object.setShadow({
                        color: object.stroke,
                    });
                    this.highlightingNode(object, 300);
                    this.canvas.renderAll();
                    return;
                }
            }
            object.set({
                opacity: 0.2,
            });
            if (object.superType === 'node') {
                if (object.toPort) {
                    object.toPort.set({
                        opacity: 0.2,
                    });
                }
                object.fromPort.forEach((port) => {
                    port.set({
                        opacity: 0.2,
                    });
                });
            }
            if (!object.isAnimated) {
                object.setShadow({
                    blur: 0,
                });
            }
        });
        targetObjects.forEach((object) => {
            object.set({
                opacity: 1,
            });
            object.setShadow({
                color: object.fill,
            });
            this.highlightingNode(object, 300);
            if (object.toPort) {
                object.toPort.set({
                    opacity: 1,
                });
            }
            if (object.fromPort) {
                object.fromPort.forEach((port) => {
                    port.set({
                        opacity: 1,
                    });
                });
            }
        });
        this.canvas.renderAll();
    }

    selectById = (id: string) => {
        this.canvas.generalTools.getOriginObjects().forEach((object) => {
            if (id === object.id) {
                object.setShadow({
                    color: object.fill,
                    blur: 50,
                });
                return;
            } else if (id === object.nodeId) {
                return;
            }
            object.setShadow({
                blur: 0,
            });
        });
        this.canvas.renderAll();
    }

    deselect = () => {
        this.canvas.generalTools.getOriginObjects().forEach((object) => {
            object.set({
                opacity: 1,
            });
            if (object.superType === 'node') {
                if (object.toPort) {
                    object.toPort.set({
                        opacity: 1,
                    });
                }
                object.fromPort.forEach((port) => {
                    port.set({
                        opacity: 1,
                    });
                });
            }
            if (!object.isAnimated) {
                object.setShadow({
                    blur: 0,
                });
            }
        });
        this.canvas.renderAll();
    }

    highlightingByPath = (path: string[]) => {
        if (!path || !path.length) {
            return;
        }
        const splitPath = path.reduce((prev, curr, index) => {
            if (!path[index + 1]) {
                return prev;
            }
            const newPath = [path[index], path[index + 1]];
            prev.push(newPath);
            return prev;
        }, []);
        const targetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id === object.id));
        const nonTargetObjects = this.canvas.generalTools.getOriginObjects().filter(object => path.some(id => id !== object.id));
        const lastObject = targetObjects.filter(obj => obj.id === path[path.length - 1])[0];
        targetObjects.forEach((object) => {
            if (lastObject) {
                object.setShadow({
                    color: lastObject.fill,
                });
            } else {
                object.setShadow({
                    color: object.fill,
                });
            }
            this.highlightingNode(object);
        });
        nonTargetObjects.forEach((object) => {
            if (object.superType === 'link') {
                const { fromNode, toNode } = object;
                if (splitPath.some(findPath => fromNode.id === findPath[0] && toNode.id === findPath[1])) {
                    if (lastObject) {
                        object.setShadow({
                            color: lastObject.stroke,
                        });
                    } else {
                        object.setShadow({
                            color: object.stroke,
                        });
                    }
                    this.highlightingNode(object);
                    this.highlightingLink(object, lastObject);
                }
            }
        });
        this.canvas.renderAll();
    }

    highlightingLink = (object: any, targetObject: any, duration = 500) => {
        object.animation = {
            duration,
            type: 'flash',
            stroke: targetObject ? targetObject.stroke : object.stroke,
            loop: 1,
            delay: 0,
        };
        this.canvas.animationTools.play(object.id, false);
    }

    highlightingNode = (object: any, duration = 500) => {
        const maxBlur = 50;
        const minBlur = 0;
        const onComplete = () => {
            if (object.shadow.blur === maxBlur) {
                object.isAnimated = true;
                object.animate('shadow.blur', minBlur, {
                    easing: fabric.util.ease.easeInOutQuad,
                    onChange: (value) => {
                        object.shadow.blur = value;
                        this.canvas.renderAll();
                    },
                    onComplete: () => {
                        object.isAnimated = false;
                        if (object.superType === 'link') {
                            object.set({
                                stroke: object.originStroke,
                            });
                        }
                    },
                });
            }
        };
        object.isAnimated = true;
        object.animate('shadow.blur', maxBlur, {
            easing: fabric.util.ease.easeInOutQuad,
            duration,
            onChange: (value) => {
                object.shadow.blur = value;
                this.canvas.renderAll();
            },
            onComplete,
        });
    }
}

export default NodeTools;
