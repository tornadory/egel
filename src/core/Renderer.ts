// Vendor
import GLState from 'nanogl-state';
import {
    GL_COLOR_BUFFER_BIT,
    GL_DEPTH_BUFFER_BIT,
    GL_DEPTH_TEST,
    GL_SCISSOR_TEST,
} from 'webgl-constants';

// Camera
import Camera from '../camera/Camera';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Core
import * as Capabilities from './Capabilities';
import * as Context from './Context';
import {
    MAX_DEVICE_PIXEL_RATIO,
    RENDERER_DEFAULT_ASPECT_RATIO,
    RENDERER_DEFAULT_HEIGHT,
    RENDERER_DEFAULT_WIDTH,
} from './CoreConstants';
import Scene from './Scene';

// Utilities
import WebGLSupport from '../utilities/WebGLSupport';

let gl: WebGLRenderingContext;

interface Options {
    width?: number;
    height?: number;
    aspectRatio?: number;
    preserveDrawingBuffer?: boolean;
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

export default class Renderer {
    public width: number;
    public height: number;
    public aspectRatio: number;
    public alpha: boolean;
    public antialias: boolean;
    public depth: boolean;
    public failIfMajorPerformanceCaveat: boolean;
    public premultipliedAlpha: boolean;
    public preserveDrawingBuffer: boolean;
    public powerPreference: string;
    public stencil: boolean;
    public pixelRatio: number;
    public canvas: HTMLCanvasElement;
    public viewport: Viewport;
    public autoClear: boolean;
    public clearColor: ClearColor;

    constructor(options?: Options) {
        this.width = RENDERER_DEFAULT_WIDTH;
        this.height = RENDERER_DEFAULT_HEIGHT;
        this.aspectRatio = RENDERER_DEFAULT_ASPECT_RATIO;

        this.alpha = false;
        this.antialias = false;
        this.depth = false;

        // https://blog.tojicode.com/2013/12/failifmajorperformancecaveat-with-great.html
        this.failIfMajorPerformanceCaveat = false;
        this.premultipliedAlpha = true;

        // https://stackoverflow.com/a/27747016
        this.preserveDrawingBuffer = false;

        // TODO: handle context loss, flag doesn't work without it
        // https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2
        this.powerPreference = 'default';
        this.stencil = false;

        this.pixelRatio = Math.min(window.devicePixelRatio, MAX_DEVICE_PIXEL_RATIO);
        this.autoClear = true;
        this.clearColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        };

        Object.assign(this, options);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        const attributes = {
            alpha: this.alpha,
            antialias: this.antialias,
            depth: this.depth,
            failIfMajorPerformanceCaveat: this.failIfMajorPerformanceCaveat,
            premultipliedAlpha: this.premultipliedAlpha,
            preserveDrawingBuffer: this.preserveDrawingBuffer,
            powerPreference: this.powerPreference,
            stencil: this.stencil,
        };

        const webGLSupport = WebGLSupport();

        if (webGLSupport) {
            const context =
                (this.canvas.getContext('webgl', attributes) as WebGLRenderingContext) ||
                (this.canvas.getContext('experimental-webgl', attributes) as WebGLRenderingContext);

            Context.set(context);
        } else {
            console.warn('WebGL is not supported, please use a modern browser.');

            return;
        }

        gl = Context.get();

        Capabilities.set(gl);

        this.viewport = {
            x: 0,
            y: 0,
            width: gl.drawingBufferWidth,
            height: gl.drawingBufferHeight,
        };

        this.setClearColor();

        if (this.depth) {
            gl.enable(GL_DEPTH_TEST);
        }
    }

    public setContext(context) {
        Context.set(context);
        gl = Context.get();
    }

    public getContext() {
        return gl;
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
            this.aspectRatio = this.width / this.height;

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;

            this.setViewport(0, 0, width, height);
        }
    }

    public setDevicePixelRatio(pixelRatio = 1) {
        this.pixelRatio = Math.min(pixelRatio, MAX_DEVICE_PIXEL_RATIO) || 1;
        this.setSize(this.width, this.height);
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

    public render(
        scene: Scene,
        camera: Camera | PerspectiveCamera | OrthographicCamera,
    ) {
        gl.viewport(
            this.viewport.x,
            this.viewport.y,
            this.viewport.width,
            this.viewport.height,
        );

        gl.clearColor(
            this.clearColor.r,
            this.clearColor.g,
            this.clearColor.b,
            this.clearColor.a,
        );

        if (this.autoClear) {
            gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        }

        // Update the scene
        scene.update();

        // Render the scene objects
        scene.objects.forEach((child) => {
            child.draw(camera);
        });
    }
}
