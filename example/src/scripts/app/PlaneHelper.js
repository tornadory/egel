import { // eslint-disable-line
    Capabilities,
    Context,
    Material,
    Mesh,
	Geometry,
	Vec3,
	Texture2D,
} from 'egel';

let gl;

const customVertexShader = `
	// Uniforms
	uniform mat4 uProjectionMatrix;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uModelMatrix;
	uniform mat3 uNormalMatrix;

	// Position
	attribute vec3 aVertexPosition;
	varying vec3 vPosition;
	varying vec4 vWorldPosition;

	// Color
	uniform vec3 uDiffuse;
	varying vec3 vDiffuse;

	// Normal
	#ifdef HAS_VERTEX_NORMALS
	attribute vec3 aVertexNormal;
	varying vec3 vNormal;
	#endif

	// Texture coordinates
	#ifdef HAS_TEXTURE_COORDS
	attribute vec2 aTextureCoord;
	varying vec2 vTextureCoord;
	#endif

	void main(void) {
		vDiffuse = uDiffuse;

		// Override for custom positioning
		vec3 transformed = vec3(0.0);

		#ifdef HAS_TEXTURE_COORDS
		vTextureCoord = aTextureCoord;
		#endif

		#ifdef HAS_VERTEX_NORMALS
		vNormal = uNormalMatrix * aVertexNormal;
		#endif

		// Vertex position + offset
		vPosition = aVertexPosition + transformed;

		// Calculate world position of vertex with transformed
		vWorldPosition = uModelMatrix * vec4(aVertexPosition + transformed, 1.0);

		gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vPosition, 1.0);
	}
`;

const customFragmentShader = `
	precision highp float;

	// Uniforms
	uniform sampler2D uDebugTexture;

	// Position
	varying vec3 vPosition;
	varying vec4 vWorldPosition;

	// Color
	varying vec3 vDiffuse;

	// Normal
	#ifdef HAS_VERTEX_NORMALS
	varying vec3 vNormal;
	#endif

	// Uv
	#ifdef HAS_TEXTURE_COORDS
	varying vec2 vTextureCoord;
	#endif

	void main(void) {
		vec3 color = vDiffuse;
		color = texture2D(uDebugTexture, vTextureCoord).rgb;

		#ifdef HAS_VERTEX_NORMALS
		vec3 normal = normalize(vNormal);
		#endif

		gl_FragColor = vec4(color, 1.0);
	}
`;

class PlaneGeometry extends Geometry {
    constructor(width, height, subdivisionsX, subdivisionsY) {
		let vertices = [];
		const indices = [];
		let normals = [];
		let uvs = [];
		let index = 0;

		const spacerX = width / subdivisionsX;
		const spacerY = height / subdivisionsY;
		const offsetX = -width * 0.5;
		const offsetY = -height * 0.5;
		const spacerU = 1 / subdivisionsX;
		const spacerV = 1 / subdivisionsY;

		for (let y = 0; y < subdivisionsY; y += 1) {
			for (let x = 0; x < subdivisionsX; x += 1) {
				const triangleX = spacerX * x + offsetX;
				const triangleY = spacerY * y + offsetY;

				const u = x / subdivisionsX;
				const v = y / subdivisionsY;

				vertices = vertices.concat([triangleX, triangleY, 0]);
				vertices = vertices.concat([triangleX + spacerX, triangleY, 0]);
				vertices = vertices.concat([triangleX + spacerX, triangleY + spacerY, 0]);
				vertices = vertices.concat([triangleX, triangleY + spacerY, 0]);

				normals = normals.concat([0, 0, 1]);
				normals = normals.concat([0, 0, 1]);
				normals = normals.concat([0, 0, 1]);
				normals = normals.concat([0, 0, 1]);

				uvs = uvs.concat([u, v]);
				uvs = uvs.concat([u + spacerU, v]);
				uvs = uvs.concat([u + spacerU, v + spacerV]);
				uvs = uvs.concat([u, v + spacerV]);
			}
		}

		indices.push(index * 4 + 0);
        indices.push(index * 4 + 1);
        indices.push(index * 4 + 2);
        indices.push(index * 4 + 0);
        indices.push(index * 4 + 2);
        indices.push(index * 4 + 3);

		index += 1;

		gl = Context.get();

		super(
			new Float32Array(vertices),
			new Uint16Array(indices),
			new Float32Array(normals),
			new Float32Array(uvs),
		);
    }
}

export default class PlaneHelper extends Mesh {
    constructor(width = 5, height = 5, subdivisionsX = 1, subdivisionsY = 1) {
        const vertexShader = customVertexShader;
        const fragmentShader = customFragmentShader;

		const uvDebugTexture = new Texture2D({
			src: 'public/assets/textures/UV_debug.jpg',
			generateMipmap: true,
		});

        super(
            new PlaneGeometry(width, height, subdivisionsX, subdivisionsY),
            new Material({
                name: 'PlaneHelper',
                vertexShader,
				fragmentShader,
				uniforms: {
					uDiffuse: {
						type: '3f',
						value: Vec3.fromValues(0.5, 0.37, 0.5),
					},
					uDebugTexture: {
						type: 't',
						value: uvDebugTexture.texture,
					},
				},
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

		gl.drawElements(
			this.material.drawType,
			this.geometry.attributes.aVertexIndex.numItems,
			gl.UNSIGNED_SHORT,
			0,
		);

        if (Capabilities.extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.unbind();
        }
    }
}
