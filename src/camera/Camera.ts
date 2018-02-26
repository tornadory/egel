// Vendor
import {
    mat4 as Mat4,
    vec3 as Vec3,
} from 'gl-matrix';

// Core
import { RENDERER_DEFAULT_ASPECT_RATIO } from '../core/CoreConstants';
import Object3D from '../core/Object3D';

interface Options {
    near?: number;
    far?: number;
    fieldOfView?: number;
    position?: Vec3;
    target?: Vec3;
    up?: Vec3;
}

export default class Camera {
    public projectionMatrix: Mat4;
    public worldInverseMatrix: Mat4;
    public near: number;
    public far: number;
    public fieldOfView: number;
    public aspectRatio: number;
    public position: Vec3;
    public target: Vec3;
    public up: Vec3;

    constructor(options: Options) {
        this.projectionMatrix = Mat4.create();
        this.worldInverseMatrix = Mat4.create();
        this.near = 0.1;
        this.far = 100;
        this.fieldOfView = 70;
        this.aspectRatio = RENDERER_DEFAULT_ASPECT_RATIO;
        this.position = Vec3.create();
        this.target = Vec3.create();
        this.up = Vec3.fromValues(0, 1, 0);

        Object.assign(this, options);
    }

    public lookAt(x = 0, y = 0, z = 0) {
        Vec3.set(this.target, x, y, z);
    }

    public updateMatrixWorld() {
        Mat4.identity(this.worldInverseMatrix);
        Mat4.lookAt(this.worldInverseMatrix, this.position, this.target, this.up);
    }

    public updateProjectionMatrix() {
        // Extended by child
    }
}
