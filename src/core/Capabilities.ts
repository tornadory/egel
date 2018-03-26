// Core
import * as Context from './Context';

function getExtensions(gl: WebGLRenderingContext) {
    const vertexArrayObjectExtension = gl.getExtension('OES_vertex_array_object') || false;
    const standardDerivativesExtension = gl.getExtension('OES_standard_derivatives') || false;

    return {
        vertexArrayObjectExtension,
        standardDerivativesExtension,
    };
}

let extensions: any = {};

export function set(gl: WebGLRenderingContext) {
    extensions = getExtensions(gl);
}

export { extensions };
