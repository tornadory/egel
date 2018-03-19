// Vendor
import {
    GL_ARRAY_BUFFER,
    GL_DYNAMIC_DRAW,
    GL_STATIC_DRAW,
} from 'webgl-constants';

import * as Context from './Context';

let gl: WebGLRenderingContext;

export function createBuffer(
    type: GLenum,
    data: Float32Array | Uint16Array,
    isDynamic: boolean = false,
) {
    gl = Context.get();

    const buffer = gl.createBuffer();
    const usage = isDynamic ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW;
    const ArrayView = type === GL_ARRAY_BUFFER ? Float32Array : Uint16Array;

    gl.bindBuffer(type, buffer);
    gl.bufferData(type, new ArrayView(data), usage);
    gl.bindBuffer(type, null);

    return buffer;
}
