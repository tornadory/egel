// Core
import * as Context from '../core/Context';
import { createBuffer } from '../core/CoreUtilities';

let gl: WebGLRenderingContext;

export default class BufferAttribute {
    public type: number;
    public data: number[];
    public itemSize: number;
    public numItems: number;
    public buffer: WebGLBuffer;
    public shaderAttribute: boolean;

    constructor(
        type: GLenum,
        data: any, // Float32Array | Uint16Array | Uint32Array, (typings are wrong for createBuffer)
        itemSize: number,
        shaderAttribute = true,
    ) {
        this.type = type;
        this.itemSize = itemSize;
        this.numItems = data.length / itemSize;
        this.buffer = createBuffer(type, data);
        this.shaderAttribute = shaderAttribute;
    }

    public bind() {
        gl = Context.get();
        gl.bindBuffer(this.type, this.buffer);
    }

    public unbind() {
        gl = Context.get();
        gl.bindBuffer(this.type, null);
    }

    public update(data: Float32Array) {
        this.bind();
        gl = Context.get();
        gl.bufferSubData(this.type, 0, data);
        this.unbind();
    }

    public dispose() {
        gl = Context.get();
        gl.deleteBuffer(this.buffer);
        this.buffer = undefined;
    }
}
