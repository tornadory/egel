// Vendor
import WebGLDebug from 'webgl-debug';
import Stats from 'stats.js';
import { // eslint-disable-line
	Geometry,
	Material,
	Mesh,
	Renderer,
	Scene,
	PerspectiveCamera,
	Texture2D,
	TextureCube,
	Vec3,
	// Quat,
} from 'egel';

// Controls
import OrbitalControls from './controls/OrbitalControls';

// Helpers
import AxisHelper from './helpers/AxisHelper';
import GridHelper from './helpers/GridHelper';
// import NormalHelper from './helpers/NormalHelper';
// import PlaneTextureHelper from './helpers/PlaneTextureHelper';

// Loaders
import GLTFLoader from './loaders/GLTFLoader';
import SHLoader from './loaders/SHLoader';

// Shaders
import DamagedHelmetVertexShader from './shaders/DamagedHelmetVertexShader.vert';
import DamagedHelmetFragmentShader from './shaders/DamagedHelmetFragmentShader.frag';

// Stats
const stats = new Stats();
stats.showPanel(1); // show MS
document.body.appendChild(stats.dom);

// Scene
let mesh;
const scene = new Scene();

// WebGL debugger, useful in development, should not be in production
// function throwOnGLError(err, funcName, args) {
// 	console.error(`${WebGLDebug.glEnumToString(err)} was caused by call to ${funcName}`);
// }

// function logGLCall(funcName, args) {
// 	console.log(`gl.${funcName}(${WebGLDebug.glFunctionArgsToString(funcName, args)})`);
// }

// function validateNoneOfTheArgsAreUndefined(funcName, args) {
// 	for (let i = 0; i < args.length; i += 1) {
// 		if (args[i] === undefined) {
// 			console.error(`Undefined pass to gl.${funcName}${WebGLDebug.glFunctionArgsToString(funcName, args)})`);
// 		}
// 	}
// }

// function logAndValidate(funcName, args) {
// 	// logGLCall(funcName, args);
// 	validateNoneOfTheArgsAreUndefined(funcName, args);
// }

export default class Application {
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		// Element
		this.canvasElement = document.getElementById('app');

		// Renderer
		this.renderer = new Renderer({
			depth: true,
			stencil: true,
			aspectRatio: this.width / this.height,
		});

		// Expose the GL context to WebGLDebugUtils to log errors and calls ~ 8 - 12ms performance hit
		// const glContext = this.renderer.getContext();
		// this.renderer.setContext(WebGLDebug.makeDebugContext(glContext, throwOnGLError, logAndValidate));

		this.renderer.setDevicePixelRatio(window.devicePixelRatio);
		this.renderer.setScissorTest(true);

		this.canvasElement.appendChild(this.renderer.canvas);

		// Camera
		this.camera = new PerspectiveCamera({
			fieldOfView: 60,
			far: 500,
			aspectRatio: this.width / this.height,
		});

		Vec3.set(this.camera.position, 3, 1, 3);
		this.camera.lookAt();

		// Controls
		this.controls = new OrbitalControls(this.camera, this.renderer.canvas);
		this.controls.update();

		// Helpers
		this.gridHelper = new GridHelper(10);
		scene.add(this.gridHelper);

		this.axisHelper = new AxisHelper();
		scene.add(this.axisHelper);

		// this.planeTextureHelper = new PlaneTextureHelper(5, 5, 10, 10);
		// scene.add(this.planeTextureHelper);

		// this.planeTextureNormalHelper = new NormalHelper(this.planeTextureHelper, 0.25);
		// this.planeTextureNormalHelper.setParent(this.planeTextureHelper);
		// scene.add(this.planeTextureNormalHelper);

		// GL_TEXTURE_CUBE_MAP_POSITIVE_X = right,
		// GL_TEXTURE_CUBE_MAP_NEGATIVE_X = left,
		// GL_TEXTURE_CUBE_MAP_POSITIVE_Y = top,
		// GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = bottom,
		// GL_TEXTURE_CUBE_MAP_POSITIVE_Z = front,
		// GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = back,

		this.environmentBackgroundTexture = new Texture2D({
			src: 'public/assets/environments/bg.jpg',
		});

		this.environmentHighTexture = new Texture2D({
			src: 'public/assets/environments/env_hi.png',
		});

		this.environmentTexture = new Texture2D({
			src: 'public/assets/environments/env.png',
		});

		this.diffuseCubemapTexture = new TextureCube({
			src: [
				'public/assets/textures/papermill/diffuse/diffuse_right_0.jpg',
				'public/assets/textures/papermill/diffuse/diffuse_left_0.jpg',
				'public/assets/textures/papermill/diffuse/diffuse_top_0.jpg',
				'public/assets/textures/papermill/diffuse/diffuse_bottom_0.jpg',
				'public/assets/textures/papermill/diffuse/diffuse_front_0.jpg',
				'public/assets/textures/papermill/diffuse/diffuse_back_0.jpg',
			],
			flipY: true,
		});

		this.specularCubemapTexture = new TextureCube({
			src: [
				'public/assets/textures/papermill/specular/specular_right_0.jpg',
				'public/assets/textures/papermill/specular/specular_left_0.jpg',
				'public/assets/textures/papermill/specular/specular_top_0.jpg',
				'public/assets/textures/papermill/specular/specular_bottom_0.jpg',
				'public/assets/textures/papermill/specular/specular_front_0.jpg',
				'public/assets/textures/papermill/specular/specular_back_0.jpg',
			],
			flipY: true,
		});

		this.BRDFLUTTexture = new Texture2D({
			src: 'public/assets/textures/brdfLUT.png',
		});

		new SHLoader('public/assets/environments/sh.bin')
			.then((sphericalHarmonicsCoefficients) => {
				new GLTFLoader('public/assets/gltf/DamagedHelmet.gltf')
					.then((data) => {
						const geometry = new Geometry(
							data.meshes.vertices,
							data.meshes.indices,
							data.meshes.normals,
							data.meshes.uvs,
						);

						const material = new Material({
							name: 'DamagedHelmetMesh',
							vertexShader: DamagedHelmetVertexShader,
							fragmentShader: DamagedHelmetFragmentShader,
							uniforms: {
								uCameraPosition: {
									type: '3f',
									value: this.camera.position,
								},
								uBaseColorTexture: {
									type: 't',
									value: data.textures.baseColorTexture.texture,
								},
								uEmissiveTexture: {
									type: 't',
									value: data.textures.emissiveTexture.texture,
								},
								uMetallicRoughnessTexture: {
									type: 't',
									value: data.textures.metallicRoughnessTexture.texture,
								},
								uNormalTexture: {
									type: 't',
									value: data.textures.normalTexture.texture,
								},
								uOcclusionTexture: {
									type: 't',
									value: data.textures.occlusionTexture.texture,
								},
								uDiffuseEnvTexture: {
									type: 'tc',
									value: this.diffuseCubemapTexture.texture,
								},
								uSpecularEnvTexture: {
									type: 'tc',
									value: this.specularCubemapTexture.texture,
								},
								uBRDFLUT: {
									type: 't',
									value: this.BRDFLUTTexture.texture,
								},
								uEnvironmentBackgroundTexture: {
									type: 't',
									value: this.environmentBackgroundTexture.texture,
								},
								uEnvironmentHighTexture: {
									type: 't',
									value: this.environmentHighTexture.texture,
								},
								uEnvironmentTexture: {
									type: 't',
									value: this.environmentTexture.texture,
								},
								uSphericalHarmonicsCoefficients: {
									type: 'fv1',
									value: sphericalHarmonicsCoefficients,
								},
							},
						});

						mesh = new Mesh(geometry, material);
						Vec3.set(mesh.rotation, -Math.PI / 2, Math.PI, Math.PI / 2);
						Vec3.set(mesh.position, 0.0, 0.5, 0.0);
						scene.add(mesh);

						// this.meshNormalHelper = new NormalHelper(mesh, 0.1);
						// this.meshNormalHelper.setParent(mesh);
						// scene.add(this.meshNormalHelper);

						this.onResize();

						this.tick();

						this.addListeners();
					})
					.catch((error) => {
						console.log(`Unable to load model: status -> ${error}`); // eslint-disable-line no-console
					});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	render() {
		stats.begin();

		mesh.material.uniforms.uCameraPosition.value = this.camera.position;

		this.controls.update();
		this.camera.updateMatrixWorld();
		this.renderer.render(scene, this.camera);

		stats.end();
	}

	tick() {
		window.requestAnimationFrame(() => this.tick());
		this.render();
	}

	onResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.renderer.setSize(this.width, this.height);
		this.renderer.setScissor(0, 0, this.width, this.height);
		this.camera.aspectRatio = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}

	addListeners() {
		window.addEventListener('resize', event => this.onResize(event));
	}
}
