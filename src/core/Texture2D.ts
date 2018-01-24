// Core
import * as Context from './Context';

// Loaders
import ImageLoader from '../loaders/ImageLoader';

// Utilities
import { createCanvas } from '../utilities/Canvas';
import { warn } from '../utilities/Console';
import EventDispatcher from '../utilities/EventDispatcher';

let gl: WebGLRenderingContext;

interface Options {
    src?: string;
    magFilter?: number;
    minFilter?: number;
    wrapS?: number;
    wrapT?: number;
}

export default class Texture2D extends EventDispatcher {
    public src: string;
    public magFilter: number;
    public minFilter: number;
    public wrapS: number;
    public wrapT: number;
    public texture: WebGLTexture;
    public image: HTMLImageElement | HTMLCanvasElement;

    constructor(options: Options) {
        super();

        gl = Context.get();

        this.src = undefined;
        this.magFilter = gl.NEAREST;
        this.minFilter = gl.NEAREST;
        this.wrapS = gl.CLAMP_TO_EDGE;
        this.wrapT = gl.CLAMP_TO_EDGE;

        Object.assign(this, options);

        const { canvas } = createCanvas(1, 1);

        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
        gl.bindTexture(gl.TEXTURE_2D, null);

        if (this.src) {
            this.load(this.src);
        }
    }

    public load(src: string) {
        ImageLoader(src)
            .then(this.onTextureLoaded)
            .catch(this.onTextureError);
    }

    public onTextureLoaded = (response: HTMLCanvasElement | HTMLImageElement) => {
        this.image = response;
        this.update(this.image);
        this.emit('loaded');
    }

    public onTextureError = (error: string) => {
        warn(error);
        this.emit('error', error);
    }

    public updateImage(src: string) {
        this.src = src || this.src;
        this.load(this.src);
    }

    public update(image: HTMLCanvasElement | HTMLImageElement) {
        gl = Context.get();

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image,
        );

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public dispose() {
        gl = Context.get();

        gl.deleteTexture(this.texture);
        this.texture = undefined;
    }
}
