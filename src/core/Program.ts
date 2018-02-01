// Core
import * as Context from './Context';

// Utilities
import { log, warn } from '../utilities/Console';

let gl: WebGLRenderingContext;

const addLineNumbers = (str) => {
    const lines = str.split('\n');

    for (let i = 0; i < lines.length; i ++) {
        lines[i] = `${(i + 1)}: ${lines[i]}`;
    }

    return lines.join('\n');
};

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

    public link(
        vertexShader: string,
        fragmentShader: string,
    ) {
        this.compiledVertexShader = this.compile('vertex', vertexShader);
        this.compiledFragmentShader = this.compile('fragment', fragmentShader);

        if (!this.compiledVertexShader || !this.compiledFragmentShader) {
            return;
        }

        gl.attachShader(this.program, this.compiledVertexShader);
        gl.attachShader(this.program, this.compiledFragmentShader);

        gl.linkProgram(this.program);
        gl.validateProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(this.program);
            warn(`Failed to initialise shaders: ${info}`);
        }

        this.created = true;
    }

    public compile(type: string, source: string) {
        gl = Context.get();

        let shader;

        switch (type) {
            case 'vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            case 'fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default:
                break;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            warn(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
            log(addLineNumbers(source));
            return false;
        }

        return shader;
    }

    public setAttributeLocation(attributeName: string) {
        if (!this.created) return;

        gl = Context.get();

        this.attributeLocations[attributeName] = gl.getAttribLocation(
            this.program,
            attributeName,
        );

        gl.enableVertexAttribArray(this.attributeLocations[attributeName]);
      }

    public setAttributePointer(attributeName: string, itemSize: number) {
        gl = Context.get();

        gl.vertexAttribPointer(
            this.attributeLocations[attributeName],
            itemSize,
            gl.FLOAT,
            false,
            0,
            0,
        );
    }

    public setUniformLocation(uniforms: object, uniformName: string) {
        if (!this.created) return;

        gl = Context.get();

        uniforms[uniformName].location = gl.getUniformLocation(
            this.program,
            uniformName,
        );
    }

    public bind() {
        gl = Context.get();

        gl.useProgram(this.program);
    }

    public dispose() {
        gl = Context.get();

        let attributeLocation;

        Object.keys(this.attributeLocations).forEach((attributeName) => {
            attributeLocation = this.attributeLocations[attributeName];
            gl.disableVertexAttribArray(attributeLocation);
        });

        gl.detachShader(this.program, this.compiledVertexShader);
        gl.detachShader(this.program, this.compiledFragmentShader);
        gl.deleteProgram(this.program);
    }
}
