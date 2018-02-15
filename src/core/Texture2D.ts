// Core
import * as Context from './Context';

// Loaders
import ImageLoader from '../loaders/ImageLoader';

// Utilities
import { createCanvas } from '../utilities/Canvas';

let gl: WebGLRenderingContext;

interface Options {
    src?: string;
    magFilter?: number;
    minFilter?: number;
    wrapS?: number;
    wrapT?: number;
}

export default class Texture2D {
    public src: string;
    public magFilter: number;
    public minFilter: number;
    public wrapS: number;
    public wrapT: number;
    public texture: WebGLTexture;
    public image: HTMLImageElement | HTMLCanvasElement;

    constructor(options: Options) {
        gl = Context.get();

        this.src = null;
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
    }

    public onTextureError = (error: string) => {
        console.warn(error);
    }

    public updateImage(src: string) {
        this.src = src || this.src;
        this.load(this.src);
    }

    public update(image: HTMLCanvasElement | HTMLImageElement) {
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
        gl.deleteTexture(this.texture);
        delete this.texture;
    }
}
