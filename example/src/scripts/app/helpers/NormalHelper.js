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
	uniform mat3 uNormalMatrix;

	void main(void) {
		gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
	}
`;

const customFragmentShader = `
    precision highp float;

	void main(void) {
	    gl_FragColor = vec4(1.0);
	}
`;

class NormalGeometry extends Geometry {
    constructor(mesh, size = 0.5) {
		let vertices = [];

		const sx = mesh.scale[0];
		const sy = mesh.scale[1];
		const sz = mesh.scale[2];
		const length = mesh.geometry.bufferNormals.length / 3;

		for (let i = 0; i < length; i += 1) {
			const i3 = i * 3;
			const v0x = sx * mesh.geometry.bufferVertices[i3];
			const v0y = sy * mesh.geometry.bufferVertices[i3 + 1];
			const v0z = sz * mesh.geometry.bufferVertices[i3 + 2];
			const nx = mesh.geometry.bufferNormals[i3];
			const ny = mesh.geometry.bufferNormals[i3 + 1];
			const nz = mesh.geometry.bufferNormals[i3 + 2];
			const v1x = v0x + size * nx;
			const v1y = v0y + size * ny;
			const v1z = v0z + size * nz;
			vertices = vertices.concat([v0x, v0y, v0z, v1x, v1y, v1z]);
		}

		gl = Context.get();

		super(new Float32Array(vertices));
      }
}

export default class NormalHelper extends Mesh {
    constructor(mesh, size = 1) {
        const vertexShader = customVertexShader;
        const fragmentShader = customFragmentShader;

        super(
            new NormalGeometry(mesh, size),
            new Material({
                name: 'NormalHelper',
                vertexShader,
                fragmentShader,
            }),
        );
    }

    draw(camera) {
        if (!this.visible) return;

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
