// Vendor
import { mat4, vec3 } from 'gl-matrix';

// Camera
import Camera from './Camera';

interface Options {
    near?: number;
    far?: number;
    fieldOfView?: number;
    position?: vec3;
    target?: vec3;
    up?: vec3;
}

export default class PerspectiveCamera extends Camera {
    constructor(options: Options) {
        super(options);
        this.isPespectiveCamera = true;
    }

    public updateProjectionMatrix() {
        mat4.perspective(
            this.projectionMatrix,
            this.fieldOfView,
            this.aspectRatio,
            this.near,
            this.far,
        );
    }
}
