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

    // Downgrade to low precision
    return 'lowp';
}

function getCapabilities(gl: WebGLRenderingContext) {
    let precision = PRECISION;
    const maxPrecision = getMaxPrecision(gl, precision);

    if (maxPrecision !== precision) {
        warn(`Capabilities: ${precision} not supported, using ${maxPrecision} instead`);
        precision = maxPrecision;
    }

    return {
        precision,
    };
}

function getExtensions(gl: WebGLRenderingContext) {
    const vertexArrayObjectExtension = gl.getExtension('OES_vertex_array_object') || false;

    return {
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
