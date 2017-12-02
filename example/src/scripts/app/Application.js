// Vendor
import * as Egel from 'egel';

export default class Application {
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		// Element
		this.element = document.getElementById('app');

		// Renderer
		this.renderer = new Egel.Renderer({
			aspectRatio: this.width / this.height,
		});
		this.renderer.setDevicePixelRatio(window.devicePixelRatio);
		this.renderer.setScissorTest(true);
		this.element.appendChild(this.renderer.canvas);

		// Scene
		this.scene = new Egel.Scene();

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

		this.grid = new Egel.GridHelper(10);
		this.scene.add(this.grid);

		this.onResize();

		this.tick();

		this.addListeners();
	}

	render() {
		this.controls.update();
		this.renderer.setScissor(0, 0, this.width, this.height);
		this.renderer.setViewport(0, 0, this.width, this.height);
		this.renderer.render(this.scene, this.camera);
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
