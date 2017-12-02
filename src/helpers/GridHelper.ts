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

// Math
import { lerp } from '../math/Utilities';

let gl: WebGLRenderingContext;

const customVertexShader = `
    attribute vec3 aVertexPosition;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    }
`;

const customFragmentShader = () => `
    precision ${capabilities.precision} float;

    void main() {
        gl_FragColor = vec4(vec3(0.5), 1.0);
    }
`;

class GridGeometry extends Geometry {
    constructor(size: number, divisions: number) {
        let vertices = [];
        const halfSize = size * 0.5;

        for (let i = 0; i < divisions + 1; i += 1) {
            const x1 = lerp(-halfSize, halfSize, i / divisions);
            const y1 = 0;
            const z1 = -halfSize;
            const x2 = lerp(-halfSize, halfSize, i / divisions);
            const y2 = 0;
            const z2 = halfSize;
            vertices = vertices.concat([x1, y1, z1, x2, y2, z2]);
        }

        for (let i = 0; i < divisions + 1; i += 1) {
            const x1 = -halfSize;
            const y1 = 0;
            const z1 = lerp(-halfSize, halfSize, i / divisions);
            const x2 = halfSize;
            const y2 = 0;
            const z2 = lerp(-halfSize, halfSize, i / divisions);
            vertices = vertices.concat([x1, y1, z1, x2, y2, z2]);
        }

        super(new Float32Array(vertices));
    }
}

export default class GridHelper extends Mesh {
    constructor(size = 1, divisions = 10) {
        gl = Context.get();

        const vertexShader = customVertexShader;
        const fragmentShader = customFragmentShader();

        super(
            new GridGeometry(size, divisions),
            new Material({
                name: 'GridHelper',
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
            this.bindAttributesInstanced();
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
