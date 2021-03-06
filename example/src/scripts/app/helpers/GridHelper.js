import { // eslint-disable-line
    Capabilities,
    Context,
    Material,
    Mesh,
    Geometry,
} from 'egel';

import {
	GL_LINES,
} from 'webgl-constants';

let gl;

const customVertexShader = `
    attribute vec3 aVertexPosition;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    }
`;

const customFragmentShader = `
    precision highp float;

    void main(void) {
        gl_FragColor = vec4(vec3(0.5), 1.0);
    }
`;

function lerp(min, max, alpha) {
    return min + (max - min) * alpha;
}

class GridGeometry extends Geometry {
    constructor(size, divisions) {
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

        gl = Context.get();

        super(new Float32Array(vertices));
    }
}

export default class GridHelper extends Mesh {
    constructor(size = 1, divisions = 10) {
        const vertexShader = customVertexShader;
        const fragmentShader = customFragmentShader;

        super(
            new GridGeometry(size, divisions),
            new Material({
                name: 'GridHelper',
                vertexShader,
                fragmentShader,
            }),
        );
    }

    draw(camera) {
        if (!this.visible) {
			return;
		}

        // Update modelMatrix
        this.updateMatrix(camera);

        this.material.program.bind();
        this.material.setUniforms(
            camera.projectionMatrix,
            this.modelViewMatrix,
            this.modelMatrix,
        );

        if (Capabilities.extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.bind();
        } else {
            this.bindAttributes();
            this.bindIndexBuffer();
        }

        gl.drawArrays(
            GL_LINES,
            0,
            this.geometry.attributes.aVertexPosition.numItems,
        );

        if (Capabilities.extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.unbind();
        }
    }
}
