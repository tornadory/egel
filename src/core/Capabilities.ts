// Core
import * as Context from './Context';

function getExtensions(gl: WebGLRenderingContext) {
    const vertexArrayObjectExtension = gl.getExtension('OES_vertex_array_object') || false;

    return {
        vertexArrayObjectExtension,
    };
}

let extensions: any = {};

export function set(gl: WebGLRenderingContext) {
    extensions = getExtensions(gl);
}

export { extensions };
