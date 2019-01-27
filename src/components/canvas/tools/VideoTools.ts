import { fabric } from 'fabric';

import 'mediaelement';
import 'mediaelement/build/mediaelementplayer.min.css';

import { ITools } from './Tools';
import { IStaticObject, IStaticCanvas } from '../Canvas';

export interface IVideoTools extends ITools {
    play?(): void;
    pause?(): void;
    stop?(): void;
    create(obj: IStaticObject, src: any): void;
    load(obj: IStaticObject, src: any): void;
    set(obj: IStaticObject, src: string | File): void;
}

class VideoTools implements IVideoTools {
    canvas: IStaticCanvas;
    container?: React.RefObject<HTMLDivElement>;

    constructor(canvas: IStaticCanvas, container?: React.RefObject<HTMLDivElement>) {
        this.canvas = canvas;
        this.container = container;
    }

    create(obj: IStaticObject, src: any) {
        const { editable } = this.canvas;
        const { id, video: { autoplay, muted, loop } } = obj;
        const { left, top } = obj.getBoundingRect();
        const videoElement = fabric.util.makeElement('video', {
            id,
            autoplay,
            muted,
            loop,
            preload: 'none',
            controls: false,
        });
        const { scaleX, scaleY, angle } = obj;
        const zoom = this.canvas.getZoom();
        const width = obj.width * scaleX * zoom;
        const height = obj.height * scaleY * zoom;
        const video = fabric.util.wrapElement(videoElement, 'div', {
            id: `${obj.id}_container`,
            style: `transform: rotate(${angle}deg);
                    width: ${width}px;
                    height: ${height}px;
                    left: ${left}px;
                    top: ${top}px;
                    position: absolute;`,
        });
        this.container.current.appendChild(video);
        const player = new MediaElementPlayer(obj.id, {
            pauseOtherPlayers: false,
            videoWidth: '100%',
            videoHeight: '100%',
            success: (mediaeElement, originalNode, instance) => {
                if (editable) {
                    instance.pause();
                }
                // https://www.youtube.com/watch?v=bbAQtfoQMp8
                // console.log(mediaeElement, originalNode, instance);
            },
        });
        player.setPlayerSize(width, height);
        player.setSrc(src.src);
        if (editable) {
            this.canvas.elementTools.draggable(video, obj);
            video.addEventListener('mousedown', (e) => {
                this.canvas.setActiveObject(obj);
                this.canvas.renderAll();
            }, false);
        }
        obj.setCoords();
        obj.set('player', player);
    }

    load(obj: IStaticObject, src: any) {
        const { canvas } = this;
        const { editable } = this.canvas;
        if (editable) {
            this.canvas.elementTools.removeById(obj.id);
        }
        this.create(obj, src);
        this.canvas.renderAll();
        fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });
    }

    set(obj: IStaticObject, src: string | File) {
        let newSrc;
        if (typeof src === 'string') {
            obj.set('file', null);
            obj.set('src', src);
            newSrc = {
                src,
            };
            this.load(obj, newSrc);
        } else {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                obj.set('file', src);
                obj.set('src', e.target.result);
                newSrc = {
                    src: e.target.result,
                    type: src.type,
                };
                this.load(obj, newSrc);
            };
            reader.readAsDataURL(src);
        }
    }
}

export default VideoTools;
