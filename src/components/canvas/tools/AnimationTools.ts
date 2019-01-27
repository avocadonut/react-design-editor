import anime, { AnimeInstance } from 'animejs';

import Tools, { ITools } from './Tools';
import { IStaticObject } from '../Canvas';

export interface IAnimationTools extends ITools {
    play(id: string, hasControls?: boolean): void;
    pause(id: string): void;
    stop(id: string, hasControls?: boolean): void;
    restart(id: string): void;
    initAnimation(obj: IStaticObject, hasControls?: boolean): void;
    getAnimation(obj: IStaticObject, hasControls?: boolean): AnimeInstance | null;
}

class AnimationTools extends Tools implements IAnimationTools {
    play(id: string, hasControls?: boolean) {
        const findObject = this.canvas.generalTools.findById(id);
        if (!findObject) {
            return;
        }
        if (findObject.anime) {
            findObject.anime.restart();
            return;
        }
        if (findObject.animation.type === 'none') {
            return;
        }
        const instance = this.getAnimation(findObject, hasControls);
        if (instance) {
            findObject.set('anime', instance);
            findObject.set({
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: 'pointer',
            });
            this.canvas.renderAll();
            instance.play();
        }
    }

    pause(id: string) {
        const findObject = this.canvas.generalTools.findById(id);
        if (!findObject) {
            return;
        }
        findObject.anime.pause();
    }

    stop(id: string, hasControls: boolean = true) {
        const findObject = this.canvas.generalTools.findById(id);
        if (!findObject) {
            return;
        }
        this.initAnimation(findObject, hasControls);
    }

    restart(id: string) {
        const findObject = this.canvas.generalTools.findById(id);
        if (!findObject) {
            return;
        }
        if (!findObject.anime) {
            return;
        }
        this.stop(id);
        this.play(id);
    }

    initAnimation(obj: IStaticObject, hasControls: boolean = true) {
        if (!obj.anime) {
            return;
        }
        let option;
        if (this.canvas.editable) {
            option = {
                anime: null,
                hasControls,
                lockMovementX: !hasControls,
                lockMovementY: !hasControls,
                hoverCursor: hasControls ? 'move' : 'pointer',
            };
        } else {
            option = {
                anime: null,
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: 'pointer',
            };
        }
        anime.remove(obj);
        const { type } = obj.animation;
        if (type === 'fade') {
            Object.assign(option, {
                opacity: obj.originOpacity,
                originOpacity: null,
            });
        } else if (type === 'bounce') {
            if (obj.animation.bounce === 'vertical') {
                Object.assign(option, {
                    top: obj.originTop,
                    originTop: null,
                });
            } else {
                Object.assign(option, {
                    left: obj.originLeft,
                    originLeft: null,
                });
            }
        } else if (type === 'shake') {
            if (obj.animation.shake === 'vertical') {
                Object.assign(option, {
                    top: obj.originTop,
                    originTop: null,
                });
            } else {
                Object.assign(option, {
                    left: obj.originLeft,
                    originLeft: null,
                });
            }
        } else if (type === 'scaling') {
            Object.assign(option, {
                scaleX: obj.originScaleX,
                scaleY: obj.originScaleY,
                originScaleX: null,
                originScaleY: null,
            });
        } else if (type === 'rotation') {
            Object.assign(option, {
                angle: obj.originAngle,
                originAngle: null,
            });
        } else if (type === 'flash') {
            Object.assign(option, {
                fill: obj.originFill,
                stroke: obj.originStroke,
                originFill: null,
                origniStroke: null,
            });
        } else {
            console.warn('Not supported type.');
        }
        obj.set(option);
        this.canvas.renderAll();
    }

    getAnimation(obj: IStaticObject, hasControls?: boolean) {
        const {
            delay = 100,
            duration = 100,
            autoplay = true,
            loop = true,
            type,
            ...other
        } = obj.animation;
        const option = {
            targets: obj,
            delay,
            loop,
            autoplay,
            duration,
            direction: 'alternate',
            begin: () => {
                obj.set({
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    hoverCursor: 'pointer',
                });
                this.canvas.renderAll();
            },
            update: (e) => {
                if (type === 'flash') {
                    // I do not know why it works. Magic code...
                    const fill = e.animations[0].currentValue;
                    const stroke = e.animations[1].currentValue;
                    obj.set('fill', '');
                    obj.set('fill', fill);
                    obj.set('stroke', stroke);
                }
                obj.setCoords();
                this.canvas.renderAll();
            },
            complete: () => {
                this.initAnimation(obj, hasControls);
            },
        };
        if (type === 'fade') {
            const { opacity = 0 } = other;
            obj.set('originOpacity', obj.opacity);
            Object.assign(option, {
                opacity,
                easing: 'easeInQuad',
            });
        } else if (type === 'bounce') {
            const { offset = 1 } = other;
            if (other.bounce === 'vertical') {
                obj.set('originTop', obj.top);
                Object.assign(option, {
                    top: obj.top + offset,
                    easing: 'easeInQuad',
                });
            } else {
                obj.set('originLeft', obj.left);
                Object.assign(option, {
                    left: obj.left + offset,
                    easing: 'easeInQuad',
                });
            }
        } else if (type === 'shake') {
            const { offset = 1 } = other;
            if (other.shake === 'vertical') {
                obj.set('originTop', obj.top);
                Object.assign(option, {
                    top: obj.top + offset,
                    delay: 0,
                    elasticity: 1000,
                    duration: 500,
                });
            } else {
                obj.set('originLeft', obj.left);
                Object.assign(option, {
                    left: obj.left + offset,
                    delay: 0,
                    elasticity: 1000,
                    duration: 500,
                });
            }
        } else if (type === 'scaling') {
            const { scale = 1 } = other;
            obj.set('originScaleX', obj.scaleX);
            obj.set('originScaleY', obj.scaleY);
            const scaleX = obj.scaleX * scale;
            const scaleY = obj.scaleY * scale;
            Object.assign(option, {
                scaleX,
                scaleY,
                easing: 'easeInQuad',
            });
        } else if (type === 'rotation') {
            obj.set('originAngle', obj.angle);
            Object.assign(option, {
                angle: other.angle,
                easing: 'easeInQuad',
            });
        } else if (type === 'flash') {
            const { fill = obj.fill, stroke = obj.stroke } = other;
            obj.set('originFill', obj.fill);
            obj.set('originStroke', obj.stroke);
            Object.assign(option, {
                fill,
                stroke,
                easing: 'easeInQuad',
            });
        } else {
            console.warn('Not supported type.');
            return null;
        }
        return anime(option);
    }
}

export default AnimationTools;
