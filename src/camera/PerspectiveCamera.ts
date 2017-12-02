// Vendor
import { mat4 } from 'gl-matrix';

// Camera
import Camera from './Camera';

// Math
import Vector3 from '../math/Vector3';

interface Options {
    near?: number;
    far?: number;
    fieldOfView?: number;
    position?: Vector3;
    target?: Vector3;
    up?: Vector3;
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
        this.aspect,
        this.near,
        this.far,
    );
  }
}
