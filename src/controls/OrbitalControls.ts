// Vendor
import {
    vec3 as Vec3,
} from 'gl-matrix';

// Camera
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Math
import { EPSILON, HALF_PI } from '../math/MathConstants';
import { clamp } from '../math/Utilities';

const IS_WHEEL_SUPPORTED = ('onwheel' in window);
const IS_MOUSEWHEEL_SUPPORTED = ('onmousewheel' in window);

const MODE_DRAG = 'MODE_DRAG';
const MODE_PAN = 'MODE_PAN';

const UP = Vec3.fromValues(0, 1, 0);
const EASE_THRESHOLD = EPSILON;

export default class OrbitalControls {
    public rotationSpeed: number;
    public panSpeed: number;
    public zoom: boolean;
    public pan: boolean;
    public smoothing: boolean;
    public easing: number;
    public isDragging: boolean;
    public camera: PerspectiveCamera;
    public element: HTMLElement;
    public zoomMin: number;
    public zoomMax: number;
    public radius: number;
    public radiusOffset: number;
    public defaultRadius: number;
    public rotationX: number;
    public rotationY: number;
    public defaultRotationX: number;
    public defaultRotationY: number;
    public x: number;
    public y: number;
    public z: number;
    public offsetX: number;
    public offsetY: number;
    public offsetPanX: number;
    public offsetPanY: number;
    public target: Vec3;
    public targetOffset: Vec3;
    public direction: Vec3;
    public lastZoomDistance: number;
    public width: number;
    public height: number;
    public mode: string;
    public isDown: boolean;
    public startX: number;
    public startY: number;

    constructor(
        camera: PerspectiveCamera,
        element: HTMLCanvasElement | HTMLDivElement,
    ) {
        this.camera = camera;
        this.element = element;

        this.rotationSpeed = 5;
        this.panSpeed = 10;
        this.zoom = true;
        this.pan = true;
        this.easing = 0.1;

        this.zoomMin = 0.1;
        this.zoomMax = Infinity;

        this.radius = Math.max(camera.position[0], camera.position[2]);
        this.radiusOffset = 0;
        this.defaultRadius = Math.max(camera.position[0], camera.position[2]);

        this.rotationX = Math.atan2(camera.position[1] - 0, this.radius - 0);
        this.rotationY = Math.atan2(camera.position[2] - 0, camera.position[0] - 0);
        this.defaultRotationX = Math.atan2(camera.position[1] - 0, this.radius - 0);
        this.defaultRotationY = Math.atan2(camera.position[2] - 0, camera.position[0] - 0);

        this.x = Math.sin(this.rotationY) * (this.radius * Math.cos(this.rotationX));
        this.y = this.radius * Math.sin(this.rotationX);
        this.z = Math.cos(this.rotationY) * (this.radius * Math.cos(this.rotationX));

        this.offsetX = 0;
        this.offsetY = 0;
        this.offsetPanX = 0;
        this.offsetPanY = 0;

        this.target = Vec3.create();
        this.targetOffset = Vec3.create();

        this.direction = Vec3.create();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.addListeners();
    }

    public onKeypress(event) {
        switch (event.which) {
            case 114:
            case 82:
                this.reset();
                break;
            default:
                break;
        }
    }

    public onWheel(event) {
        if (!this.zoom) return;

        const delta = event.deltaY ? event.deltaY : (event.detail ? event.detail : 0);
        const value = delta / 500;
        const speed = 3;

        this.radius += value * speed;
        this.radius = clamp(this.radius, this.zoomMin, this.zoomMax);

        this.update();
    }

    public onContextMenu(event) {
        event.preventDefault();
    }

    public onDown(event) {
        switch (event.which) {
            case 3:
                this.mode = MODE_PAN;
                this.offsetX = this.target[0];
                this.offsetY = this.target[1];
                break;
            default: {
                this.mode = MODE_DRAG;
                this.offsetX = this.rotationX;
                this.offsetY = this.rotationY;
                break;
            }
        }

        this.startX = event.pageY / this.height;
        this.startY = event.pageX / this.width;

        Vec3.copy(this.targetOffset, this.target);
        this.radiusOffset = this.radius;

        this.isDown = true;
    }

    public onMove(event) {
        if (this.isDown) {
            switch (this.mode) {
                case MODE_PAN: {
                    if (!this.pan) return;
                    const x = event.pageY / this.height;
                    const y = event.pageX / this.width;

                    Vec3.copy(this.direction, this.camera.position);
                    Vec3.subtract(this.direction, this.direction, this.target);
                    Vec3.normalize(this.direction, this.direction);

                    const cross = Vec3.cross(this.direction, this.direction, UP);
                    const targetX = this.targetOffset[0] + -((this.startY - y) * this.panSpeed * cross[0]);
                    const targetY = this.targetOffset[1] + -((this.startX - x) * this.panSpeed);
                    const targetZ = this.targetOffset[2] + -((this.startY - y) * this.panSpeed * cross[2]);

                    Vec3.set(this.target, targetX, targetY, targetZ);
                    break;
                }
                default: {
                    const x = event.pageY / this.height;
                    const y = event.pageX / this.width;
                    this.rotationX = this.offsetX + -((this.startX - x) * this.rotationSpeed);
                    this.rotationY = this.offsetY + ((this.startY - y) * this.rotationSpeed);
                    this.rotationX = clamp(this.rotationX, -HALF_PI, HALF_PI);
                    break;
                }
            }

            this.update();
        }
    }

    public onUp(event) {
        this.isDown = false;
    }

    public update() {
        const x = Math.sin(this.rotationY) * (this.radius * Math.cos(this.rotationX));
        const y = this.radius * Math.sin(this.rotationX);
        const z = Math.cos(this.rotationY) * (this.radius * Math.cos(this.rotationX));

        this.x += (x - this.x) * this.easing;
        this.y += (y - this.y) * this.easing;
        this.z += (z - this.z) * this.easing;

        if (Math.abs(this.x - x) < EPSILON) this.x = x;
        if (Math.abs(this.y - y) < EPSILON) this.y = y;
        if (Math.abs(this.z - z) < EPSILON) this.z = z;

        Vec3.set(this.camera.position, this.x, this.y, this.z);
        Vec3.add(this.camera.position, this.camera.position, this.target);
        this.camera.lookAt(this.target[0], this.target[1], this.target[2]);
    }

    public reset() {
        Vec3.set(this.target, 0, 0, 0);
        this.rotationX = this.defaultRotationX;
        this.rotationY = this.defaultRotationY;
        this.radius = this.defaultRadius;
        this.update();
    }

    public addListeners() {
        window.addEventListener('keypress', (event) => this.onKeypress(event), false);
        this.element.addEventListener('contextmenu', (event) => this.onContextMenu(event), false);

        if (IS_WHEEL_SUPPORTED) {
            window.addEventListener('wheel', (event) => this.onWheel(event));
        } else if (IS_MOUSEWHEEL_SUPPORTED) {
            window.addEventListener('mousewheel', (event) => this.onWheel(event));
        }

        this.element.addEventListener('mousedown', (event) => this.onDown(event), false);
        this.element.addEventListener('mousemove', (event) => this.onMove(event), false);
        this.element.addEventListener('mouseup', (event) => this.onUp(event), false);
    }

    public dispose() {
        window.removeEventListener('keypress', (event) => this.onKeypress(event));
        this.element.removeEventListener('contextmenu', (event) => this.onContextMenu(event));

        if (IS_WHEEL_SUPPORTED) {
            window.addEventListener('wheel', (event) => this.onWheel(event));
        } else if (IS_MOUSEWHEEL_SUPPORTED) {
            window.addEventListener('mousewheel', (event) => this.onWheel(event));
        }

        this.element.removeEventListener('mousedown', (event) => this.onDown(event), false);
        this.element.removeEventListener('mousemove', (event) => this.onMove(event), false);
        this.element.removeEventListener('mouseup', (event) => this.onUp(event), false);

        this.camera = undefined;
        this.element = undefined;
    }
}
