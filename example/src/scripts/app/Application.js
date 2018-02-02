// Vendor
import * as Egel from 'egel'; // eslint-disable-line
import Stats from 'stats.js';

console.log(
	Egel.Mat2,
	Egel.Mat2d,
	Egel.Mat3,
	Egel.Mat4,
	Egel.Quat,
	Egel.Vec2,
	Egel.Vec3,
	Egel.Vec4,
);

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Scene
const scene = new Egel.Scene();

export default class Application {
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		// Element
		this.canvasElement = document.getElementById('app');

		// Renderer
		this.renderer = new Egel.Renderer({
			depth: true,
			stencil: true,
			aspectRatio: this.width / this.height,
		});

		this.renderer.setDevicePixelRatio(window.devicePixelRatio);
		this.renderer.setScissorTest(true);

		this.canvasElement.appendChild(this.renderer.canvas);

		// Camera
		this.camera = new Egel.PerspectiveCamera({
			fieldOfView: 45,
			far: 500,
			aspectRatio: this.width / this.height,
		});

		this.camera.position.set(3, 2, 3);
		this.camera.lookAt();

		// Controls
		this.controls = new Egel.OrbitalControls(this.camera, this.renderer.canvas);
		this.controls.update();

		this.gridHelper = new Egel.GridHelper(10);
		scene.add(this.gridHelper);

		this.axisHelper = new Egel.AxisHelper();
		scene.add(this.axisHelper);

		// const texture0 = new Egel.Texture2D({
		// 	src: 'public/assets/textures/example.png',
		// });

		// new Egel.OBJLoader('public/assets/models/bunny.obj')
		// 	.then((data) => {
		// 		const geometry = new Egel.Geometry(data.vertices, data.indices, data.normals, data.uvs);

		// 		const material = new Egel.Material({
		// 			hookName: 'BunnyMesh',
		// 			hookFragmentPre: `
		// 				uniform sampler2D uTexture0;
		// 			`,
		// 			hookFragmentMain: `
		// 				color = texture2D(uTexture0, vUv).rgb;
		// 			`,
		// 			uniforms: {
		// 				uDiffuse: {
		// 					type: '3f',
		// 					value: new Egel.Vector3(0.5, 0.87, 1.0).v,
		// 				},
		// 				uTexture0: {
		// 					type: 't',
		// 					value: texture0.texture,
		// 				},
		// 			},
		// 		});

		// 		const mesh = new Egel.Mesh(geometry, material);
		// 		mesh.scale.set(0.5, 0.5, 0.5);
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
