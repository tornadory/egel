// Vendor
import { // eslint-disable-line
    Capabilities,
    Context,
    Material,
    Mesh,
	TextureCube,
} from 'egel';

// Geometry
import CubeGeometry from '../geometry/CubeGeometry';

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
	uniform samplerCube uHelperTexture;

	// Uv
	#ifdef HAS_TEXTURE_COORDS
	varying vec2 vTextureCoord;
	#endif


	// Normal
	#ifdef HAS_VERTEX_NORMALS
	varying vec3 vNormal;
	#endif

	void main(void) {
		vec3 color = textureCube(uHelperTexture, vNormal).rgb;

		gl_FragColor = vec4(color, 1.0);
	}
`;

export default class TextureCubeHelper extends Mesh {
    constructor(width = 5, height = 5, depth = 5) {
		gl = Context.get();

		const helperTexture = new TextureCube({
			src: [
				'public/assets/textures/papermill/environment/environment_right_0.jpg',
				'public/assets/textures/papermill/environment/environment_left_0.jpg',
				'public/assets/textures/papermill/environment/environment_top_0.jpg',
				'public/assets/textures/papermill/environment/environment_bottom_0.jpg',
				'public/assets/textures/papermill/environment/environment_front_0.jpg',
				'public/assets/textures/papermill/environment/environment_back_0.jpg',
			],
			flipY: true,
		});

        super(
            new CubeGeometry(width, height, depth),
            new Material({
                name: 'TextureCubeHelper',
                vertexShader,
				fragmentShader,
				uniforms: {
					uHelperTexture: {
						type: 'tc',
						value: helperTexture.texture,
					},
				},
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
