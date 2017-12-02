// Vendor
import { mat4 } from 'gl-matrix';

// Core
import { RENDERER_DEFAULT_ASPECT_RATIO } from '../core/CoreConstants';
import Object3D from '../core/Object3D';

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

export default class Camera {
    public projectionMatrix: mat4;
    public worldInverseMatrix: mat4;
    public isCamera: boolean;
    public isPespectiveCamera: boolean;
    public isOrthographicCamera: boolean;
    public near: number;
    public far: number;
    public fieldOfView: number;
    public aspectRatio: number;
    public position: Vector3;
    public target: Vector3;
    public up: Vector3;

    constructor(options: Options) {
        this.projectionMatrix = mat4.create();
        this.worldInverseMatrix = mat4.create();
        this.isCamera = true;
        this.isPespectiveCamera = false;
        this.isOrthographicCamera = false;
        this.near = 0.1;
        this.far = 100;
        this.fieldOfView = 70;
        this.aspectRatio = RENDERER_DEFAULT_ASPECT_RATIO;
        this.position = new Vector3();
        this.target = new Vector3();
        this.up = new Vector3(0, 1, 0);

        Object.assign(this, options);
    }

    public lookAt(x = 0, y = 0, z = 0) {
        this.target.set(x, y, z);
    }

    public updateMatrixWorld() {
        mat4.identity(this.worldInverseMatrix);
        mat4.lookAt(
            this.worldInverseMatrix,
            this.position.v,
            this.target.v,
            this.up.v,
        );
    }

    public updateProjectionMatrix() {
        // Override
    }
}
