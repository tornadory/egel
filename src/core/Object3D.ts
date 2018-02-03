// Vendor
import {
    mat4 as Mat4,
    quat as Quat,
    vec3 as Vec3,
} from 'gl-matrix';

// Camera
import Camera from '../camera/Camera';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Math
import { lookAt } from '../math/Utilities';

let axisAngle = 0;
const quaternionAxisAngle = Vec3.create();

export default class Object3D {
    public children: Object3D[];
    public localMatrix: Mat4;
    public modelMatrix: Mat4;
    public modelViewMatrix: Mat4;
    public position: Vec3;
    public rotation: Vec3;
    public scale: Vec3;
    public isObject3D: boolean;
    public parent: Object3D;
    public matrixAutoUpdate: boolean;
    public quaternion: Quat;
    public quaternionLookAt: Quat;
    public lookAtUp: Vec3;

    constructor() {
        this.children = [];
        this.localMatrix = Mat4.create();
        this.modelMatrix = Mat4.create();
        this.modelViewMatrix = Mat4.create();
        this.matrixAutoUpdate = true;
        this.position = Vec3.create();
        this.rotation = Vec3.create();
        this.scale = Vec3.fromValues(1, 1, 1);
        this.isObject3D = true;
        this.quaternion = Quat.create();
        this.quaternionLookAt = Quat.create();
        this.lookAtUp = Vec3.create(); // needs to be [0, 0, 0] although it should be [0, 1, 0]
    }

    public updateMatrix(camera: Camera | PerspectiveCamera | OrthographicCamera) {
        Mat4.identity(this.modelViewMatrix);

        if (this.matrixAutoUpdate) {
            // Reset
            Mat4.identity(this.localMatrix);
            Mat4.identity(this.modelMatrix);
            Quat.identity(this.quaternion);

            // If Object3D has a parent, copy the computed modelMatrix into localMatrix
            if (this.parent) {
                Mat4.copy(this.localMatrix, this.parent.modelMatrix);
                Mat4.multiply(this.modelMatrix, this.modelMatrix, this.localMatrix);
            }

            // Use lookAt quat as base
            // Note: this.rotation isn't updated if lookAt's used
            Quat.copy(this.quaternion, this.quaternionLookAt);

            // Apply local transitions to modelMatrix
            Mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
            Quat.rotateX(this.quaternion, this.quaternion, this.rotation[0]);
            Quat.rotateY(this.quaternion, this.quaternion, this.rotation[1]);
            Quat.rotateZ(this.quaternion, this.quaternion, this.rotation[2]);
            axisAngle = Quat.getAxisAngle(quaternionAxisAngle, this.quaternion);
            Mat4.rotate(
                this.modelMatrix,
                this.modelMatrix,
                axisAngle,
                quaternionAxisAngle,
            );
            Mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
        }

        // Model View Matrix
        if (camera) {
            Mat4.multiply(
                this.modelViewMatrix,
                camera.worldInverseMatrix,
                this.modelMatrix,
            );
        }
    }

    public lookAt(target: Vec3) {
        Quat.identity(this.quaternionLookAt);
        this.quaternionLookAt = lookAt(this.position, target, this.lookAtUp);
    }

    public setParent(parent: Object3D) {
        this.unsetParent();

        if (parent.isObject3D) {
            parent.children.push(this);
            this.parent = parent;
        }
    }

    public unsetParent() {
        if (this.parent === undefined) return;

        const objectIndex = this.parent.children.indexOf(this);

        if (objectIndex !== -1) {
            this.parent.children.splice(objectIndex, 1);
            this.parent = undefined;
        }
    }

    public dispose() {
        this.unsetParent();
        this.children = [];
        this.localMatrix = undefined;
        this.modelMatrix = undefined;
        this.position = undefined;
        this.rotation = undefined;
        this.scale = undefined;
        this.quaternion = undefined;
        this.isObject3D = undefined;
    }
}
