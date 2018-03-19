// Vendor
import Stats from 'stats.js';
import { // eslint-disable-line
	Geometry,
	Material,
	Mesh,
	Renderer,
	Scene,
	PerspectiveCamera,
	Texture2D,
	Vec3,
} from 'egel.min';

import AxisHelper from './AxisHelper';
import GridHelper from './GridHelper';
import OBJLoader from './OBJLoader';
import OrbitalControls from './OrbitalControls';

// Shaders
import BunnyVertexShader from './shaders/BunnyVertexShader.vert';
import BunnyFragmentShader from './shaders/BunnyFragmentShader.frag';

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

		Vec3.set(this.camera.position, 3, 2, 3);
		this.camera.lookAt();

		// Controls
		this.controls = new OrbitalControls(this.camera, this.renderer.canvas);
		this.controls.update();

		this.gridHelper = new GridHelper(10);
		scene.add(this.gridHelper);

		this.axisHelper = new AxisHelper();
		scene.add(this.axisHelper);

		const texture0 = new Texture2D({
			src: 'public/assets/textures/example.png',
		});

		new OBJLoader('public/assets/models/bunny.obj')
			.then((data) => {
				const geometry = new Geometry(
					data.vertices,
					data.indices,
					data.normals,
					data.uvs,
				);

				const material = new Material({
					name: 'BunnyMesh',
					vertexShader: BunnyVertexShader,
					fragmentShader: BunnyFragmentShader,
					uniforms: {
						uDiffuse: {
							type: '3f',
							value: Vec3.fromValues(0.5, 0.37, 0.5),
						},
						uTexture0: {
							type: 't',
							value: texture0.texture,
						},
					},
				});

				const mesh = new Mesh(geometry, material);
				Vec3.set(mesh.scale, 0.5, 0.5, 0.5);

				scene.add(mesh);
			})
			.catch((error) => {
				console.log(`Unable to load model: status -> ${error}`); // eslint-disable-line no-console
			});

		this.onResize();

		this.tick();

		this.addListeners();
	}

	render() {
		stats.begin();

		this.controls.update();
		this.renderer.setScissor(0, 0, this.width, this.height);
		this.renderer.setViewport(0, 0, this.width, this.height);
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
		this.camera.aspectRatio = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}

	addListeners() {
		window.addEventListener('resize', event => this.onResize(event));
	}
}
