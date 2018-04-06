// Vendor
import {
    GL_CLAMP_TO_EDGE,
    GL_DATA_UNSIGNED_BYTE,
    GL_LINEAR,
    GL_LINEAR_MIPMAP_LINEAR,
    GL_NEAREST,
    GL_RGBA,
    GL_TEXTURE_2D,
    GL_TEXTURE_MAG_FILTER,
    GL_TEXTURE_MIN_FILTER,
    GL_TEXTURE_WRAP_S,
    GL_TEXTURE_WRAP_T,
    GL_UNPACK_FLIP_Y_WEBGL,
} from 'webgl-constants';

// Core
import * as Context from './Context';

// Loaders
import ImageLoader from '../loaders/ImageLoader';

// Math
import { isPowerOfTwo } from '../math/MathUtilities';

// Utilities
import { createCanvas } from '../utilities/Canvas';

let gl: WebGLRenderingContext;

interface Options {
    src?: string;
    magFilter?: number;
    minFilter?: number;
    wrapS?: number;
    wrapT?: number;
    generateMipmap?: boolean;
    flipY?: boolean;
}

export default class Texture2D {
    public src: string;
    public magFilter: number;
    public minFilter: number;
    public wrapS: number;
    public wrapT: number;
    public generateMipmap?: boolean;
    public flipY: boolean;
    public texture: WebGLTexture;
    public image: HTMLImageElement | HTMLCanvasElement;

    constructor(options: Options) {
        gl = Context.get();

        this.src = null;
        this.magFilter = GL_NEAREST;
        this.minFilter = GL_NEAREST;
        this.wrapS = GL_CLAMP_TO_EDGE;
        this.wrapT = GL_CLAMP_TO_EDGE;
        this.generateMipmap = false;
        this.flipY = false;

        Object.assign(this, options);

        const { canvas } = createCanvas(1, 1);

        this.texture = gl.createTexture();

        gl.bindTexture(GL_TEXTURE_2D, this.texture);
        gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, GL_RGBA, GL_DATA_UNSIGNED_BYTE, canvas);
        gl.bindTexture(GL_TEXTURE_2D, null);

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
        gl.bindTexture(GL_TEXTURE_2D, this.texture);
        gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, this.flipY);
        gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, GL_RGBA, GL_DATA_UNSIGNED_BYTE, image);

        if (this.generateMipmap && isPowerOfTwo(this.texture)) {
            gl.generateMipmap(GL_TEXTURE_2D);
        }

        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, this.wrapT);

        gl.bindTexture(GL_TEXTURE_2D, null);
    }

    public dispose() {
        gl.deleteTexture(this.texture);

        delete this.texture;
    }
}
