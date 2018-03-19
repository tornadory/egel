// Vendor
import {
    GL_CLAMP_TO_EDGE,
    GL_COLOR_ATTACHMENT0,
    GL_COLOR_BUFFER_BIT,
    GL_DATA_UNSIGNED_BYTE,
    GL_DEPTH_ATTACHMENT,
    GL_DEPTH_BUFFER_BIT,
    GL_DEPTH_COMPONENT16,
    GL_FRAMEBUFFER,
    GL_LINEAR,
    GL_RENDERBUFFER,
    GL_RGBA,
    GL_SCISSOR_TEST,
    GL_TEXTURE_2D,
    GL_TEXTURE_MAG_FILTER,
    GL_TEXTURE_MIN_FILTER,
    GL_TEXTURE_WRAP_S,
    GL_TEXTURE_WRAP_T,
} from 'webgl-constants';

// Camera
import Camera from '../camera/Camera';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Core
import * as Context from './Context';
import Scene from './Scene';

let gl: WebGLRenderingContext;

interface Options {
    width?: number;
    height?: number;
    aspectRatio?: number;
    pixelRatio?: number;
}

interface Viewport {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ClearColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export default class RenderTarget {
    public width: number;
    public height: number;
    public ratio: number;
    public pixelRatio: number;
    public frameBuffer: WebGLFramebuffer;
    public renderBuffer: WebGLRenderbuffer;
    public texture: WebGLTexture;
    public viewport: Viewport;
    public autoClear: boolean;
    public clearColor: ClearColor;

    constructor(options: Options) {
        this.pixelRatio = options.pixelRatio || 1;
        this.width = options.width * this.pixelRatio;
        this.height = options.height * this.pixelRatio;
        this.ratio = this.width / this.height;
        this.viewport = {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
        };
        this.autoClear = true;
        this.clearColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        };

        gl = Context.get();

        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(GL_FRAMEBUFFER, this.frameBuffer);

        this.texture = gl.createTexture();
        gl.bindTexture(GL_TEXTURE_2D, this.texture);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, this.width, this.height, 0, GL_RGBA, GL_DATA_UNSIGNED_BYTE, null);

        this.renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(GL_RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT16, this.width, this.height);
        gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, this.renderBuffer);
        gl.bindTexture(GL_TEXTURE_2D, null);
        gl.bindRenderbuffer(GL_RENDERBUFFER, null);
        gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    }

    public setClearColor(r = 0, g = 0, b = 0, a = 1) {
        this.clearColor.r = r;
        this.clearColor.g = g;
        this.clearColor.b = b;
        this.clearColor.a = a;
    }

    public setSize(width: number, height: number) {
        const newWidth = width * this.pixelRatio;
        const newHeight = height * this.pixelRatio;

        if (newWidth !== this.width || newHeight !== this.height) {
            this.width = width * this.pixelRatio;
            this.height = height * this.pixelRatio;
            this.ratio = this.width / this.height;

            gl.bindTexture(GL_TEXTURE_2D, this.texture);
            gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, this.width, this.height, 0, GL_RGBA, GL_DATA_UNSIGNED_BYTE, null);
            gl.bindTexture(GL_TEXTURE_2D, null);
            gl.bindRenderbuffer(GL_RENDERBUFFER, this.renderBuffer);
            gl.renderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT16, this.width, this.height);
            gl.bindRenderbuffer(GL_RENDERBUFFER, null);

            this.setViewport(0, 0, width, height);
        }
    }

    public setScissorTest(enable = false) {
        if (enable) {
            gl.enable(GL_SCISSOR_TEST);
        } else {
            gl.disable(GL_SCISSOR_TEST);
        }
    }

    public setScissor(x: number, y: number, width: number, height: number) {
        gl.scissor(
            x * this.pixelRatio,
            y * this.pixelRatio,
            width * this.pixelRatio,
            height * this.pixelRatio,
        );
    }

    public setViewport(x: number, y: number, width: number, height: number) {
        this.viewport.x = x * this.pixelRatio;
        this.viewport.y = y * this.pixelRatio;
        this.viewport.width = width * this.pixelRatio;
        this.viewport.height = height * this.pixelRatio;
    }

    public render(scene: Scene, camera: PerspectiveCamera | OrthographicCamera) {
        gl.viewport(
            this.viewport.x,
            this.viewport.y,
            this.viewport.width,
            this.viewport.height,
        );

        gl.bindFramebuffer(GL_FRAMEBUFFER, this.frameBuffer);

        if (this.autoClear) {
            gl.clearColor(
                this.clearColor.r,
                this.clearColor.g,
                this.clearColor.b,
                this.clearColor.a,
            );
            gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        }

        // Update the scene
        scene.update();

        // Render the scene objects
        scene.objects.forEach((child) => {
            child.draw(camera);
        });

        gl.bindTexture(GL_TEXTURE_2D, this.texture);
        gl.bindTexture(GL_TEXTURE_2D, null);

        // Reset
        gl.bindFramebuffer(GL_FRAMEBUFFER, null);
    }
}
