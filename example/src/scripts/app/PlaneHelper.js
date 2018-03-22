import { // eslint-disable-line
    Capabilities,
    Context,
    Material,
    Mesh,
	Geometry,
	Vec3,
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

	vec3 CalculatePointLight(
		vec3 lightPosition,
		vec3 ambientColor,
		float ambientIntensity,
		vec3 specularColor,
		vec3 specularIntensity,
		vec3 normal
	) {
		vec3 lightDirection = normalize(lightPosition - vWorldPosition.xyz);

		// diffuse shading
		float diff = max(dot(normal, lightDirection), 0.0);

		// specular shading
		vec3 reflectDirection = reflect(-lightDirection, normal);

		// Fix the spec from showing on the backside by multiplying it by the lambert term
		float spec = diff * pow(max(dot(lightDirection, reflectDirection), 0.0), 0.25);

		// attenuation
		float constant = 1.0;
		float linear = 0.09;
		float quadratic = 0.032;

		float dist = length(lightPosition);
		float attenuation = 1.0 / (constant + linear * dist + quadratic * (dist * dist));

		// combine results
		vec3 ambient = (ambientColor * ambientIntensity) * vDiffuse;
		vec3 diffuse = diff * vDiffuse;
		vec3 specular = specularColor * spec * specularIntensity;
		ambient *= attenuation;
		diffuse *= attenuation;
		specular *= attenuation;
		return (ambient + diffuse + specular);
	}

	void main(void) {
		vec3 color = vDiffuse;

		#ifdef HAS_VERTEX_NORMALS
		vec3 normal = normalize(vNormal);
		#endif

		color += CalculatePointLight(
			vec3(0.5, 1.0, 2.0), // lightPosition
			vec3(1.0, 0.73, 0.5), // ambientColor
			0.5, // ambientIntensity
			vec3(0.25), // specularColor
			vec3(1), // specularIntensity
			normal
		);

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

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            this.geometry.attributes.aVertexPosition.numItems,
        );

        if (Capabilities.extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.unbind();
        }
    }
}
