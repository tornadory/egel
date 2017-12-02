// Vendor
import { mat4 } from 'gl-matrix';

import Mesh from './Mesh';

export default class Scene {
    public objects: Mesh[];

    constructor() {
        this.objects = [];
    }

    public add(object: Mesh) {
        this.objects.push(object);
    }

    public remove(object: Mesh, dispose = false) {
        const objectIndex = this.objects.indexOf(object);

        if (objectIndex !== -1) {
            this.objects.splice(objectIndex, 1);

            if (dispose) {
                object.dispose();
                object = undefined;
            }
        }
    }
}
