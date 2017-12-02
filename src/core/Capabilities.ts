// Core
import * as Context from './Context';
import { PRECISION } from './CoreConstants';

// Utilities
import { warn } from '../utilities/Console';

function getMaxPrecision(
    gl: WebGLRenderingContext,
    precision: string,
) {
    if (precision === 'highp') {
        if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
            gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
            return 'highp';
        }

        // Downgrade to medium precision
        precision = 'mediump';
    }

    if (precision === 'mediump') {
        if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
            gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
            return 'mediump';
        }
    }

    return 'lowp';
}

function getCapabilities(gl: WebGLRenderingContext) {
    let precision = PRECISION;
    const maxPrecision = getMaxPrecision(gl, precision);

    if (maxPrecision !== precision) {
        warn(`Capabilities: ${precision} not supported, using ${maxPrecision} instead`);
        precision = maxPrecision;
    }

    const maxTextures: number = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    const maxVertexTextures: number = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

    const maxTextureSize: number = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxCubemapSize: number = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

    const maxAttributes: number = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    const maxVertexUniforms: number = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    const maxVaryings: number = gl.getParameter(gl.MAX_VARYING_VECTORS);
    const maxFragmentUniforms: number = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

    return {
        maxTextures,
        maxVertexTextures,

        maxTextureSize,
        maxCubemapSize,

        maxAttributes,
        maxVertexUniforms,
        maxVaryings,
        maxFragmentUniforms,

        precision,
    };
}

function getExtensions(gl: WebGLRenderingContext) {
    const angleInstancedArraysExtension = gl.getExtension('ANGLE_instanced_arrays') || false;
    const vertexArrayObjectExtension = gl.getExtension('OES_vertex_array_object') || false;
    const textureFloatExtension = gl.getExtension('OES_texture_float') || false;

    return {
        angleInstancedArraysExtension,
        textureFloatExtension,
        vertexArrayObjectExtension,
    };
}

let capabilities: any = {};
let extensions: any = {};

export function set(gl: WebGLRenderingContext) {
    capabilities = getCapabilities(gl);
    extensions = getExtensions(gl);
}

export { capabilities, extensions };
