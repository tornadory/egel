// Vendor
import { mat4 } from 'gl-matrix';

// Camera
import Camera from '../camera/Camera';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Core
import * as Capabilities from './Capabilities';
import * as Context from './Context';
import { RENDERER_DEFAULT_HEIGHT, RENDERER_DEFAULT_RATIO, RENDERER_DEFAULT_WIDTH, WEBGL_CONTEXT } from './CoreConstants';
import Scene from './Scene';

// Utilities
import { log, warn } from '../utilities/Console';
import Support from '../utilities/Support';

let gl: WebGLRenderingContext;

interface Options {
    width?: number;
    height?: number;
    ratio?: number;
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
    public ratio: number;
    public preserveDrawingBuffer: boolean;
    public pixelRatio: number;
    public canvas: HTMLCanvasElement;
    public viewport: Viewport;
    public autoClear: boolean;
    public clearColor: ClearColor;

    constructor(options?: Options) {
        this.width = RENDERER_DEFAULT_WIDTH;
        this.height = RENDERER_DEFAULT_HEIGHT;
        this.ratio = RENDERER_DEFAULT_RATIO;
        this.preserveDrawingBuffer = false;
        this.pixelRatio = 1;
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
            preserveDrawingBuffer: this.preserveDrawingBuffer,
        };

        const support = Support();

        if (support) {
            const context =
            (this.canvas.getContext('webgl', attributes) as WebGLRenderingContext) ||
            (this.canvas.getContext('experimental-webgl', attributes) as WebGLRenderingContext);

            Context.set(context);
        } else {
            warn('WebGL is not supported');
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
        gl.enable(gl.DEPTH_TEST);
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

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;

            this.setViewport(0, 0, width, height);
        }
    }

    public setDevicePixelRatio(ratio = 1) {
        this.pixelRatio = ratio || 1;
        this.setSize(this.width, this.height);
    }

    public setScissorTest(enable = false) {
        if (enable) {
          gl.enable(gl.SCISSOR_TEST);
        } else {
          gl.disable(gl.SCISSOR_TEST);
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
        camera: Camera | PerspectiveCamera | OrthorgraphicCamera,
    ) {
        gl = Context.get();

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
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        // Update the scene
        scene.update();

        // Render the scene objects
        scene.objects.forEach((child) => {
            if (child.isInstanced) {
                child.drawInstance(camera);
            } else {
                child.draw(camera);
            }
        });
    }
}
