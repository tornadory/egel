// Vendor
import { // eslint-disable-line
	Capabilities,
	Context,
	Material,
	Mesh,
} from 'egel';

// Geometry
import PlaneGeometry from '../geometry/PlaneGeometry';

let gl;

const vertexShader = `
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

		#ifdef HAS_TEXTURE_COORDS
		vTextureCoord = aTextureCoord;
		#endif

		#ifdef HAS_VERTEX_NORMALS
		vNormal = uNormalMatrix * aVertexNormal;
		#endif

		// Vertex position + offset
		vPosition = aVertexPosition;

		// Calculate world position of vertex
		vWorldPosition = uModelMatrix * vec4(aVertexPosition, 1.0);

		gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vPosition, 1.0);
	}
`;

const fragmentShader = `
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

export default class RenderTargetHelper {
	constructor(texture) {
		gl = Context.get();

		this.renderTargetHelper = new Mesh(
			new PlaneGeometry(),
			new Material({
				name: 'RenderTargetHelper',
				vertexShader,
				fragmentShader,
				uniforms: {
					uDebugTexture: {
						type: 't',
						value: texture,
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

