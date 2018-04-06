// Vendor
import {
    GL_COMPILE_STATUS,
    GL_DATA_FLOAT,
    GL_FRAGMENT_SHADER,
    GL_LINK_STATUS,
    GL_VERTEX_SHADER,
} from 'webgl-constants';

// Core
import * as Context from './Context';

// Utilities
import { addLineNumbers } from '../utilities/Logging';

let gl: WebGLRenderingContext;

export default class Program {
    public program: WebGLProgram;
    public created: boolean;
    public attributeLocations: object;
    public compiledVertexShader: string | boolean;
    public compiledFragmentShader: string | boolean;

    constructor() {
        gl = Context.get();

        this.program = gl.createProgram();
        this.created = false;

        // Cache all attribute locations
        this.attributeLocations = {};
    }

    public link(vertexShader: string, fragmentShader: string) {
        this.compiledVertexShader = this.compile('vertex', vertexShader);
        this.compiledFragmentShader = this.compile('fragment', fragmentShader);

        if (!this.compiledVertexShader || !this.compiledFragmentShader) {
            return;
        }

        gl.attachShader(this.program, this.compiledVertexShader);
        gl.attachShader(this.program, this.compiledFragmentShader);

        gl.linkProgram(this.program);
        gl.validateProgram(this.program);

        if (!gl.getProgramParameter(this.program, GL_LINK_STATUS)) {
            const info = gl.getProgramInfoLog(this.program);
            console.warn(`Failed to initialise shaders: ${info}`);
        }

        this.created = true;
    }

    public compile(type: string, source: string) {
        let shader;

        if (type === 'vertex') {
            shader = gl.createShader(GL_VERTEX_SHADER);
        } else {
            shader = gl.createShader(GL_FRAGMENT_SHADER);
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
            console.warn(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
            console.log(addLineNumbers(source));

            return false;
        }

        return shader;
    }

    public setAttributeLocation(attributeName: string) {
        if (!this.created) {
            return;
        }

        this.attributeLocations[attributeName] = gl.getAttribLocation(this.program, attributeName);
        gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
      }

    public setAttributePointer(attributeName: string, itemSize: number) {
        gl.vertexAttribPointer(this.attributeLocations[attributeName], itemSize, GL_DATA_FLOAT, false, 0, 0);
    }

    public setUniformLocation(uniforms: object, uniformName: string) {
        if (!this.created) {
            return;
        }

        uniforms[uniformName].location = gl.getUniformLocation(this.program, uniformName);
    }

    public bind() {
        gl.useProgram(this.program);
    }

    public dispose() {
        let attributeLocation;

        Object.keys(this.attributeLocations).forEach((attributeName) => {
            attributeLocation = this.attributeLocations[attributeName];
            gl.disableVertexAttribArray(attributeLocation);
        });

        gl.detachShader(this.program, this.compiledVertexShader);
        gl.detachShader(this.program, this.compiledFragmentShader);
        gl.deleteProgram(this.program);

        delete this.program;
        delete this.compiledVertexShader;
        delete this.compiledFragmentShader;
    }
}
