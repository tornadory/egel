// Vendor
import { mat4, quat, vec3 } from 'gl-matrix';

// Camera
import Camera from '../camera/Camera';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Math
import { lookAt } from '../math/Utilities';

let axisAngle = 0;
const quaternionAxisAngle = vec3.create();

export default class Object3D {
    public children: Object3D[];
    public localMatrix: mat4;
    public modelMatrix: mat4;
    public modelViewMatrix: mat4;
    public position: vec3;
    public rotation: vec3;
    public scale: vec3;
    public isObject3D: boolean;
    public parent: Object3D;
    public matrixAutoUpdate: boolean;
    public quaternion: quat;
    public quaternionLookAt: quat;
    public lookAtUp: vec3;

    constructor() {
        this.children = [];
        this.localMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();
        this.matrixAutoUpdate = true;
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);
        this.isObject3D = true;
        this.quaternion = quat.create();
        this.quaternionLookAt = quat.create();
        this.lookAtUp = vec3.create(); // needs to be [0, 0, 0] although it should be [0, 1, 0]
    }

    public updateMatrix(camera: Camera | PerspectiveCamera | OrthographicCamera) {
        mat4.identity(this.modelViewMatrix);

        if (this.matrixAutoUpdate) {
            // Reset
            mat4.identity(this.localMatrix);
            mat4.identity(this.modelMatrix);
            quat.identity(this.quaternion);

            // If Object3D has a parent, copy the computed modelMatrix into localMatrix
            if (this.parent) {
                mat4.copy(this.localMatrix, this.parent.modelMatrix);
                mat4.multiply(this.modelMatrix, this.modelMatrix, this.localMatrix);
            }

            // Use lookAt quat as base
            // Note: this.rotation isn't updated if lookAt's used
            quat.copy(this.quaternion, this.quaternionLookAt);

            // Apply local transitions to modelMatrix
            mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
            quat.rotateX(this.quaternion, this.quaternion, this.rotation[0]);
            quat.rotateY(this.quaternion, this.quaternion, this.rotation[1]);
            quat.rotateZ(this.quaternion, this.quaternion, this.rotation[2]);
            axisAngle = quat.getAxisAngle(quaternionAxisAngle, this.quaternion);
            mat4.rotate(
                this.modelMatrix,
                this.modelMatrix,
                axisAngle,
                quaternionAxisAngle,
            );
            mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
        }

        // Model View Matrix
        if (camera) {
            mat4.multiply(
                this.modelViewMatrix,
                camera.worldInverseMatrix,
                this.modelMatrix,
            );
        }
    }

    public lookAt(target: vec3) {
        quat.identity(this.quaternionLookAt);
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
