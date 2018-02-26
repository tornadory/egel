// Vendor
import {
    mat4 as Mat4,
    vec3 as Vec3,
} from 'gl-matrix';

// Camera
import Camera from './Camera';

interface Options {
    near?: number;
    far?: number;
    fieldOfView?: number;
    position?: Vec3;
    target?: Vec3;
    up?: Vec3;
}

export default class PerspectiveCamera extends Camera {
    constructor(options: Options) {
        super(options);
    }

    public updateProjectionMatrix() {
        Mat4.perspective(this.projectionMatrix, this.fieldOfView, this.aspectRatio, this.near, this.far);
    }
}
