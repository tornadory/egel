// Vendor
import {
    mat3 as Mat3,
    mat4 as Mat4,
    vec3 as Vec3,
} from 'gl-matrix';
import {
    GL_TEXTURE0,
    GL_TEXTURE1,
    GL_TEXTURE10,
    GL_TEXTURE11,
    GL_TEXTURE12,
    GL_TEXTURE13,
    GL_TEXTURE14,
    GL_TEXTURE15,
    GL_TEXTURE16,
    GL_TEXTURE17,
    GL_TEXTURE18,
    GL_TEXTURE19,
    GL_TEXTURE2,
    GL_TEXTURE20,
    GL_TEXTURE21,
    GL_TEXTURE22,
    GL_TEXTURE23,
    GL_TEXTURE24,
    GL_TEXTURE25,
    GL_TEXTURE26,
    GL_TEXTURE27,
    GL_TEXTURE28,
    GL_TEXTURE29,
    GL_TEXTURE3,
    GL_TEXTURE30,
    GL_TEXTURE31,
    GL_TEXTURE4,
    GL_TEXTURE5,
    GL_TEXTURE6,
    GL_TEXTURE7,
    GL_TEXTURE8,
    GL_TEXTURE9,
    GL_TEXTURE_2D,
    GL_TEXTURE_CUBE_MAP,
    GL_TRIANGLES,
} from 'webgl-constants';

// Camera
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Core
import * as Context from './Context';
import Program from './Program';

// Geometry
import Geometry from '../geometry/Geometry';

let gl: WebGLRenderingContext;
const normalMatrix: Mat3 = Mat3.create();
const inversedModelViewMatrix: Mat4 = Mat4.create();

interface Options {
    type?: string;
    uniforms?: any;
    name?: string;
    vertexShader?: string;
    fragmentShader?: string;
    drawType?: number;
    culling?: number;
}

export default class Material {
    public type: string;
    public uniforms: any;
    public name: string;
    public vertexShader: string;
    public fragmentShader: string;
    public drawType: number;
    public culling: number;

    public program: Program;
    public customUniforms: object;

    constructor(options: Options = {}) {
        gl = Context.get();

        this.type = '';
        this.uniforms = {};
        this.name = '';
        this.vertexShader = '';
        this.fragmentShader = '';
        this.drawType = GL_TRIANGLES;
        this.culling = -1;

        Object.assign(this, options);

        this.program = new Program();
    }

    public create(geometry: Geometry) {
        this.vertexShader = this.processShader(this.vertexShader, geometry);
        this.fragmentShader = this.processShader(this.fragmentShader, geometry);

        this.program.link(this.vertexShader, this.fragmentShader);

        this.customUniforms = this.uniforms || {};

        const textureIndices = [
            GL_TEXTURE0,
            GL_TEXTURE1,
            GL_TEXTURE2,
            GL_TEXTURE3,
            GL_TEXTURE4,
            GL_TEXTURE5,
            GL_TEXTURE6,
            GL_TEXTURE7,
            GL_TEXTURE8,
            GL_TEXTURE9,
            GL_TEXTURE10,
            GL_TEXTURE11,
            GL_TEXTURE12,
            GL_TEXTURE13,
            GL_TEXTURE14,
            GL_TEXTURE15,
            GL_TEXTURE16,
            GL_TEXTURE17,
            GL_TEXTURE18,
            GL_TEXTURE19,
            GL_TEXTURE20,
            GL_TEXTURE21,
            GL_TEXTURE22,
            GL_TEXTURE23,
            GL_TEXTURE24,
            GL_TEXTURE25,
            GL_TEXTURE26,
            GL_TEXTURE27,
            GL_TEXTURE28,
            GL_TEXTURE29,
            GL_TEXTURE30,
            GL_TEXTURE31,
        ];

        Object.keys(this.uniforms).forEach((uniformName, i) => {
            switch (this.uniforms[uniformName].type) {
                case 't':
                case 'tc': {
                    this.uniforms[uniformName].textureIndex = i;
                    this.uniforms[uniformName].activeTexture = textureIndices[i];
                    break;
                }
                default:
                    break;
            }
        });

        this.uniforms = {
            uProjectionMatrix: {
                location: null,
                type: '4fv',
                value: Mat4.create(),
            },
            uModelMatrix: {
                location: null,
                type: '4fv',
                value: Mat4.create(),
            },
            uModelViewMatrix: {
                location: null,
                type: '4fv',
                value: Mat4.create(),
            },
            uNormalMatrix: {
                location: null,
                type: '4fv',
                value: Mat4.create(),
            },
            ...this.customUniforms,
        };

        Object.keys(this.uniforms).forEach((uniformName) => {
            this.program.setUniformLocation(this.uniforms, uniformName);
        });
    }

    public processShader(shader: string, geometry: Geometry) {
        let defines = '';

        function addDefine(define) {
            defines += `#define ${define} \n`;
        }

        // Shader name
        if (this.name) {
            addDefine(`SHADER_NAME ${this.name}`);
        }

        // Vertex normals
        if (geometry.bufferNormals) {
            addDefine('HAS_VERTEX_NORMALS');
        }

        // Vertex colors
        if (geometry.bufferColors) {
            addDefine('HAS_VERTEX_COLORS');
        }

        // Texture coordinates
        if (geometry.bufferUvs) {
            addDefine('HAS_TEXTURE_COORDS');
        }

        return `
            ${defines}
            ${shader}
        `;
    }

    public setUniforms(
        projectionMatrix: Mat4,
        modelViewMatrix: Mat4,
        modelMatrix: Mat4,
        camera?: PerspectiveCamera | OrthographicCamera,
    ) {
        Object.keys(this.customUniforms).forEach((uniformName) => {
            const uniform = this.uniforms[uniformName];

            switch (uniform.type) {
                case 't': {
                    gl.uniform1i(uniform.location, uniform.textureIndex);
                    gl.activeTexture(uniform.activeTexture);
                    gl.bindTexture(GL_TEXTURE_2D, uniform.value);
                    break;
                }
                case 'tc': {
                    gl.uniform1i(uniform.location, uniform.textureIndex);
                    gl.activeTexture(uniform.activeTexture);
                    gl.bindTexture(GL_TEXTURE_CUBE_MAP, uniform.value);
                    break;
                }
                case 'i': {
                    gl.uniform1i(uniform.location, uniform.value);
                    break;
                }
                case 'f': {
                    gl.uniform1f(uniform.location, uniform.value);
                    break;
                }
                case '2f': {
                    gl.uniform2f(uniform.location, uniform.value[0], uniform.value[1]);
                    break;
                }
                case '3f': {
                    gl.uniform3f(uniform.location, uniform.value[0], uniform.value[1], uniform.value[2]);
                    break;
                }
                case '4f': {
                    gl.uniform4f(
                        uniform.location,
                        uniform.value[0],
                        uniform.value[1],
                        uniform.value[2],
                        uniform.value[3],
                    );
                    break;
                }
                case '1iv': {
                    gl.uniform1iv(uniform.location, uniform.value);
                    break;
                }
                case '2iv': {
                    gl.uniform2iv(uniform.location, uniform.value);
                    break;
                }
                case '1fv': {
                    gl.uniform1fv(uniform.location, uniform.value);
                    break;
                }
                case '2fv': {
                    gl.uniform2fv(uniform.location, uniform.value);
                    break;
                }
                case '3fv': {
                    gl.uniform3fv(uniform.location, uniform.value);
                    break;
                }
                case '4fv': {
                    gl.uniform4fv(uniform.location, uniform.value);
                    break;
                }
                case 'Matrix3fv': {
                    gl.uniformMatrix3fv(uniform.location, false, uniform.value);
                    break;
                }
                case 'Matrix4fv': {
                    gl.uniformMatrix4fv(uniform.location, false, uniform.value);
                    break;
                }
                default: {
                    break;
                }
            }
        });

        gl.uniformMatrix4fv(this.uniforms.uProjectionMatrix.location, false, projectionMatrix);

        gl.uniformMatrix4fv(this.uniforms.uModelViewMatrix.location, false, modelViewMatrix);

        gl.uniformMatrix4fv(this.uniforms.uModelMatrix.location, false, modelMatrix);

        Mat4.identity(inversedModelViewMatrix);
        Mat4.invert(inversedModelViewMatrix, modelMatrix);

        // Construct normal matrix of size 3x3 from 4x4 inverse of the model view matrix
        Mat3.identity(normalMatrix);
        Mat3.fromMat4(normalMatrix, inversedModelViewMatrix);
        Mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(this.uniforms.uNormalMatrix.location, false, normalMatrix);
    }

    public dispose() {
        // Dispose textures
        Object.keys(this.customUniforms).forEach((uniformName) => {
            const uniform = this.uniforms[uniformName];
            switch (uniform.type) {
                case 't':
                case 'tc': {
                    gl.deleteTexture(uniform.value);
                    break;
                }
                default:
                    break;
            }
        });

        this.program.dispose();

        delete this.program;
    }
}
