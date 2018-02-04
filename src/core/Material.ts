// Vendor
import {
    mat3 as Mat3,
    mat4 as Mat4,
    vec3 as Vec3,
} from 'gl-matrix';

// Camera
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Core
import { capabilities } from './Capabilities';
import * as Context from './Context';
import { CULL_NONE, DRAW_TRIANGLES } from './CoreConstants';
import Program from './Program';

// Geometry
import Geometry from '../geometry/Geometry';

// Shaders
import { BaseFragmentShader } from '../shaders/BaseFragmentShader';
import { BaseVertexShader } from '../shaders/BaseVertexShader';

let gl: WebGLRenderingContext;
const normalMatrix: Mat3 = Mat3.create();
const inversedModelViewMatrix: Mat4 = Mat4.create();

interface Options {
    type?: string;
    uniforms?: any;
    fieldOfView?: number;
    hookName?: string;
    hookVertexPre?: string;
    hookVertexMain?: string;
    hookVertexEnd?: string;
    hookFragmentPre?: string;
    hookFragmentMain?: string;
    hookFragmentEnd?: string;
    vertexShader?: string;
    fragmentShader?: string;
    drawType?: number;
    culling?: number;
}

export default class Material {
    public name: string;
    public type: string;
    public uniforms: any;
    public fieldOfView: number;
    public hookName: string;
    public hookVertexPre: string;
    public hookVertexMain: string;
    public hookVertexEnd: string;
    public hookFragmentPre: string;
    public hookFragmentMain: string;
    public hookFragmentEnd: string;
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
        this.hookName = '';
        this.hookVertexPre = '';
        this.hookVertexMain = '';
        this.hookVertexEnd = '';
        this.hookFragmentPre = '';
        this.hookFragmentMain = '';
        this.hookFragmentEnd = '';
        this.vertexShader = BaseVertexShader;
        this.fragmentShader = BaseFragmentShader;
        this.drawType = DRAW_TRIANGLES;
        this.culling = CULL_NONE;

        Object.assign(this, options);

        this.program = new Program();
    }

    public create(geometry: Geometry) {
        this.vertexShader = this.processShader(this.vertexShader, geometry);
        this.fragmentShader = this.processShader(this.fragmentShader, geometry);

        this.program.link(this.vertexShader, this.fragmentShader);

        this.customUniforms = this.uniforms || {};

        const textureIndices = [
            gl.TEXTURE0,
            gl.TEXTURE1,
            gl.TEXTURE2,
            gl.TEXTURE3,
            gl.TEXTURE4,
            gl.TEXTURE5,
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

        const projectionViewUniforms = {
            uProjectionMatrix: {
                location: null,
                type: '4fv',
                value: Mat4.create(),
            },
        };

        this.uniforms = {
            uDiffuse: {
                location: null,
                type: '3f',
                value: Vec3.create(),
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
            ...projectionViewUniforms,
        };

        Object.keys(this.uniforms).forEach((uniformName) => {
            this.program.setUniformLocation(this.uniforms, uniformName);
        });
    }

    public processShader(shader: string, geometry: Geometry) {
        let defines = '';

        const precision = `precision ${capabilities.precision} float;`;

        function addDefine(define) {
            defines += `#define ${define} \n`;
        }

        if (geometry.bufferUvs) {
            addDefine('HAS_UVS');
        }

        if (geometry.bufferColors) {
            addDefine('HAS_VERTEX_COLORS');
        }

        if (geometry.bufferNormals) {
            addDefine('HAS_NORMALS');
        }

        shader = shader.replace(/<HOOK_PRECISION>/g, precision);
        shader = shader.replace(/<HOOK_DEFINES>/g, defines);
        shader = shader.replace(/<HOOK_NAME>/g, `#define SHADER_NAME ${this.hookName}`);
        shader = shader.replace(/<HOOK_VERTEX_PRE>/g, this.hookVertexPre);
        shader = shader.replace(/<HOOK_VERTEX_MAIN>/g, this.hookVertexMain);
        shader = shader.replace(/<HOOK_VERTEX_END>/g, this.hookVertexEnd);
        shader = shader.replace(/<HOOK_FRAGMENT_PRE>/g, this.hookFragmentPre);
        shader = shader.replace(/<HOOK_FRAGMENT_MAIN>/g, this.hookFragmentMain);
        shader = shader.replace(/<HOOK_FRAGMENT_END>/g, this.hookFragmentEnd);

        return shader;
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
                    gl.bindTexture(gl.TEXTURE_2D, uniform.value);
                    break;
                }
                case 'tc': {
                    gl.uniform1i(uniform.location, uniform.textureIndex);
                    gl.activeTexture(uniform.activeTexture);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, uniform.value);
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
                    gl.uniform3f(
                        uniform.location,
                        uniform.value[0],
                        uniform.value[1],
                        uniform.value[2],
                    );
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

        gl.uniformMatrix4fv(
            this.uniforms.uProjectionMatrix.location,
            false,
            projectionMatrix,
        );

        gl.uniformMatrix4fv(
            this.uniforms.uModelViewMatrix.location,
            false,
            modelViewMatrix,
        );
        gl.uniformMatrix4fv(
            this.uniforms.uModelMatrix.location,
            false,
            modelMatrix,
        );

        Mat4.identity(inversedModelViewMatrix);
        Mat4.invert(inversedModelViewMatrix, modelMatrix);

        // Construct normal matrix of size 3x3 from 4x4 inverse of the model view matrix
        Mat3.identity(normalMatrix);
        Mat3.fromMat4(normalMatrix, inversedModelViewMatrix);
        Mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(
            this.uniforms.uNormalMatrix.location,
            false,
            normalMatrix,
        );

        // uDiffuse
        gl.uniform3f(
            this.uniforms.uDiffuse.location,
            this.uniforms.uDiffuse.value[0],
            this.uniforms.uDiffuse.value[1],
            this.uniforms.uDiffuse.value[2],
        );

        // Camera
        if (camera && this.uniforms.uCameraPosition) {
            gl.uniform3f(
                this.uniforms.uCameraPosition.location,
                camera.position[0],
                camera.position[1],
                camera.position[2],
            );
        }
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
    }
}
