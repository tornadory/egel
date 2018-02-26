// Vendor
import {
    mat4 as Mat4,
    vec3 as Vec3,
} from 'gl-matrix';

// Camera
import Camera from './Camera';

interface Options {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
    near?: number;
    far?: number;
    fieldOfView?: number;
    position?: Vec3;
    target?: Vec3;
    up?: Vec3;
}

export default class OrthographicCamera extends Camera {
    public left: number;
    public right: number;
    public bottom: number;
    public top: number;

    constructor(options: Options = {}) {
        super(options);

        this.left = options.left || -1;
        this.right = options.right || 1;
        this.bottom = options.bottom || -1;
        this.top = options.top || 1;
    }

    public updateProjectionMatrix() {
        Mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
    }
}
