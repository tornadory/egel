// Vendor
import { mat4, vec3 } from 'gl-matrix';

// Core
import { RENDERER_DEFAULT_ASPECT_RATIO } from '../core/CoreConstants';
import Object3D from '../core/Object3D';

interface Options {
    near?: number;
    far?: number;
    fieldOfView?: number;
    position?: vec3;
    target?: vec3;
    up?: vec3;
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
    public position: vec3;
    public target: vec3;
    public up: vec3;

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
        this.position = vec3.create();
        this.target = vec3.create();
        this.up = vec3.fromValues(0, 1, 0);

        Object.assign(this, options);
    }

    public lookAt(x = 0, y = 0, z = 0) {
        vec3.set(this.target, x, y, z);
    }

    public updateMatrixWorld() {
        mat4.identity(this.worldInverseMatrix);
        mat4.lookAt(
            this.worldInverseMatrix,
            this.position,
            this.target,
            this.up,
        );
    }

    public updateProjectionMatrix() {
        // Extended by child
    }
}
