// Vendor
import { mat4 } from 'gl-matrix';

// Camera
import Camera from '../camera/Camera';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Core
import { capabilities, extensions } from '../core/Capabilities';
import * as Context from '../core/Context';
import Material from '../core/Material';
import Mesh from '../core/Mesh';

// Geometry
import Geometry from '../geometry/Geometry';

let gl: WebGLRenderingContext;

const customVertexShader = `
    #define SHADER_NAME AxisHelper

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    varying vec3 vColor;

    void main(void){
        vColor = aVertexColor;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
	}
`;

const customFragmentShader = () => `
    #define SHADER_NAME AxisHelper

    precision ${capabilities.precision} float;

    varying vec3 vColor;

	void main(void){
	    gl_FragColor = vec4(vColor, 1.0);
	}
`;

class AxisGeometry extends Geometry {
    constructor(size: number) {
        let vertices = [];

        // X-axis
        vertices = vertices.concat([0, 0, 0, size, 0, 0]);

        // Y-axis
        vertices = vertices.concat([0, 0, 0, 0, size, 0]);

        // Z-axis
        vertices = vertices.concat([0, 0, 0, 0, 0, size]);

        // Colors
        const colors = new Float32Array([
          1, 0, 0,
          1, 0, 0,
          0, 1, 0,
          0, 1, 0,
          0, 0, 1,
          0, 0, 1,
        ]);

        gl = Context.get();

        super(new Float32Array(vertices), undefined, undefined, undefined, colors);
      }
}

export default class AxisHelper extends Mesh {
    constructor(size = 1) {
        const vertexShader = customVertexShader;
        const fragmentShader = customFragmentShader();

        super(
            new AxisGeometry(size),
            new Material({
                vertexShader,
                fragmentShader,
            }),
        );
    }

    public draw(camera: Camera | PerspectiveCamera | OrthographicCamera) {
        if (!this.visible) return;

        // Update modelMatrix
        this.updateMatrix(camera);

        this.material.program.bind();
        this.material.setUniforms(
            camera.projectionMatrix,
            this.modelViewMatrix,
            this.modelMatrix,
            camera,
        );

        if (extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.bind();
        } else {
            this.bindAttributes();
            this.bindIndexBuffer();
        }

        gl.drawArrays(
            gl.LINES,
            0,
            this.geometry.attributes.aVertexPosition.numItems,
        );

        if (extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.unbind();
        }
    }
}
