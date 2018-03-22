// Vendor
import Stats from 'stats.js';
import { // eslint-disable-line
	Geometry,
	Material,
	Mesh,
	Renderer,
	Scene,
	PerspectiveCamera,
	Vec3,
	// Quat,
} from 'egel';

// Controls
import OrbitalControls from './controls/OrbitalControls';

// Geometry
import PlaneMesh from './geometry/PlaneMesh';

// Helpers
import AxisHelper from './helpers/AxisHelper';
import GridHelper from './helpers/GridHelper';

// Loaders
import GLTFLoader from './loaders/GLTFLoader';
// import OBJLoader from './loaders/OBJLoader';

// Shaders
// import BunnyVertexShader from './shaders/BunnyVertexShader.vert';
// import BunnyFragmentShader from './shaders/BunnyFragmentShader.frag';
import DamagedHelmetVertexShader from './shaders/DamagedHelmetVertexShader.vert';
import DamagedHelmetFragmentShader from './shaders/DamagedHelmetFragmentShader.frag';
import NormalHelper from './helpers/NormalHelper';

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Scene
const scene = new Scene();

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

		this.renderer.setDevicePixelRatio(window.devicePixelRatio);
		this.renderer.setScissorTest(true);

		this.canvasElement.appendChild(this.renderer.canvas);

		// Camera
		this.camera = new PerspectiveCamera({
			fieldOfView: 45,
			far: 500,
			aspectRatio: this.width / this.height,
		});

		Vec3.set(this.camera.position, 3, 1, 3);
		this.camera.lookAt();

		// Controls
		this.controls = new OrbitalControls(this.camera, this.renderer.canvas);
		this.controls.update();

		// Geometry
		this.planeMesh = new PlaneMesh(5, 5, 10, 10);
		scene.add(this.planeMesh);

		// Helpers
		this.gridHelper = new GridHelper(10);
		scene.add(this.gridHelper);

		this.axisHelper = new AxisHelper();
		scene.add(this.axisHelper);

		this.planeMeshNormalHelper = new NormalHelper(this.planeMesh, 0.25);
		this.planeMeshNormalHelper.setParent(this.planeMesh);
		scene.add(this.planeMeshNormalHelper);

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
						uDiffuse: {
							type: '3f',
							value: Vec3.fromValues(0.5, 0.37, 0.5),
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
					},
				});

				const mesh = new Mesh(geometry, material);
				// const quatFromRotation = Quat.fromValues(...data.meshes.rotation);
				// const meshRotation = Vec3.fromValues(1.0, 1.0, 1.0);
				// Vec3.transformQuat(meshRotation, meshRotation, quatFromRotation);
				// Vec3.set(mesh.rotation, ...meshRotation);
				Vec3.set(mesh.rotation, -Math.PI / 2, Math.PI, Math.PI / 2);
				Vec3.set(mesh.position, -2.0, 0.5, 0.0);
				scene.add(mesh);
			})
			.catch((error) => {
				console.log(`Unable to load model: status -> ${error}`); // eslint-disable-line no-console
			});

		// new OBJLoader('public/assets/obj/bunny.obj')
		// 	.then((data) => {
		// 		const geometry = new Geometry(
		// 			data.vertices,
		// 			data.indices,
		// 			data.normals,
		// 			data.uvs,
		// 		);

		// 		const material = new Material({
		// 			name: 'BunnyMesh',
		// 			vertexShader: BunnyVertexShader,
		// 			fragmentShader: BunnyFragmentShader,
		// 			uniforms: {
		// 				uDiffuse: {
		// 					type: '3f',
		// 					value: Vec3.fromValues(0.5, 0.37, 0.5),
		// 				},
		// 			},
		// 		});

		// 		const mesh = new Mesh(geometry, material);
		// 		Vec3.set(mesh.scale, 0.5, 0.5, 0.5);

		// 		scene.add(mesh);
		// 	})
		// 	.catch((error) => {
		// 		console.log(`Unable to load model: status -> ${error}`); // eslint-disable-line no-console
		// 	});

		this.onResize();

		this.tick();

		this.addListeners();
	}

	render() {
		stats.begin();

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
