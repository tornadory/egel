// Core
import * as Context from './Context';

// Loaders
import ImageLoader from '../loaders/ImageLoader';

// Utilities
import { createCanvas } from '../utilities/Canvas';

let gl: WebGLRenderingContext;

interface Options {
    src?: string[];
    magFilter?: number;
    minFilter?: number;
    wrapS?: number;
    wrapT?: number;
}

export default class TextureCube {
    public src: string[];
    public magFilter: number;
    public minFilter: number;
    public wrapS: number;
    public wrapT: number;
    public texture: WebGLTexture;
    public loaders: any[];
    public images: Array<HTMLCanvasElement | HTMLImageElement>;

    constructor(options: Options) {
        gl = Context.get();

        this.src = Array(6).fill('');
        this.magFilter = gl.LINEAR;
        this.minFilter = gl.LINEAR;
        this.wrapS = gl.CLAMP_TO_EDGE;
        this.wrapT = gl.CLAMP_TO_EDGE;

        Object.assign(this, options);

        const { canvas } = createCanvas(1, 1);

        this.texture = gl.createTexture();
        this.images = [];
        this.loaders = [];

        const images = [];

        for (let i = 0; i < 6; i += 1) {
            images.push(canvas);
        }

        this.update(images);

        this.src.forEach((src, i) => {
            this.loaders[i] = this.load(this.src[i]);
        });

        Promise.all(this.loaders)
            .then(this.onTextureLoaded)
            .catch(this.onTextureError);
    }

    public load(src: string) {
        return ImageLoader(src);
    }

    public onTextureLoaded = (response: Array<HTMLCanvasElement | HTMLImageElement>) => {
        this.images = response;
        this.update(this.images);
    }

    public onTextureError = (error: string) => {
        console.warn(error);
    }

    public update(images: Array<HTMLCanvasElement | HTMLImageElement>) {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        const targets = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        ];

        for (let i = 0; i < 6; i += 1) {
            const image = images[i];

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

            gl.texImage2D(targets[i], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
}
