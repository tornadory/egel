import * as Context from './Context';

let gl: WebGLRenderingContext;

export function createBuffer(
    type: GLenum,
    data: Float32Array | Uint16Array,
    isDynamic: boolean = false,
) {
    gl = Context.get();

    const buffer = gl.createBuffer();
    const usage = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
    const ArrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;

    gl.bindBuffer(type, buffer);
    gl.bufferData(type, new ArrayView(data), usage);
    gl.bindBuffer(type, null);

    return buffer;
}
