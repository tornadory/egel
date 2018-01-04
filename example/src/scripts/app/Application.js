// Vendor
import * as Egel from 'egel';

// Scene
const scene = new Egel.Scene();

export default class Application {
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		// Element
		this.element = document.getElementById('app');

		// Renderer
		this.renderer = new Egel.Renderer({
			depth: true,
			// stencil: true,
			aspectRatio: this.width / this.height,
		});

		this.renderer.setDevicePixelRatio(window.devicePixelRatio);
		this.renderer.setScissorTest(true);

		this.element.appendChild(this.renderer.canvas);

		// Camera
		this.camera = new Egel.PerspectiveCamera({
			fieldOfView: 45,
			far: 500,
			aspectRatio: this.width / this.height,
		});

		this.camera.position.set(10, 5, 10);
		this.camera.lookAt();

		this.controls = new Egel.OrbitalControls(this.camera, this.renderer.canvas);
		this.controls.update();

		this.gridHelper = new Egel.GridHelper(10);
		scene.add(this.gridHelper);

		this.axisHelper = new Egel.AxisHelper();
		scene.add(this.axisHelper);

		new Egel.OBJLoader('public/assets/models/bunny.obj')
			.then((data) => {
				const geometry = new Egel.Geometry(data.vertices, data.indices, data.normals);

				const material = new Egel.Material({
					hookVertexName: 'BunnyMeshVertex',
					hookFragmentName: 'BunnyMeshFragment',
					type: 'physical',
					uniforms: {
						uDiffuse: {
							type: '3f',
							value: new Egel.Color(0xff0000).v,
						},
					},
				});

				const mesh = new Egel.Mesh(geometry, material);

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
		this.controls.update();
		this.renderer.setScissor(0, 0, this.width, this.height);
		this.renderer.setViewport(0, 0, this.width, this.height);
		this.camera.updateMatrixWorld();
		this.renderer.render(scene, this.camera);
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
		window.addEventListener('resize', _event => this.onResize(_event));
	}
}
