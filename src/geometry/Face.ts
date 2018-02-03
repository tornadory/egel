// Vendor
import {
    vec3 as Vec3,
} from 'gl-matrix';

const cb = Vec3.create();
const ab = Vec3.create();

export default class Face {
    public indices: number[];
    public vertices: Vec3[];
    public uvs: number[];
    public normal: Vec3;

    constructor(
        indiceA: number,
        indiceB: number,
        indiceC: number,
        vertexA: Vec3,
        vertexB: Vec3,
        vertexC: Vec3,
    ) {
        this.indices = [indiceA, indiceB, indiceC];
        this.vertices = [vertexA, vertexB, vertexC];
        this.uvs = [indiceA, indiceB, indiceC];
        this.normal = Vec3.create();
        this.updateFaceNormal();
    }

    public updateFaceNormal() {
        Vec3.set(cb, 0, 0, 0);
        Vec3.set(ab, 0, 0, 0);
        Vec3.subtract(cb, this.vertices[2], this.vertices[1]);
        Vec3.subtract(ab, this.vertices[0], this.vertices[1]);
        Vec3.cross(cb, cb, ab);
        Vec3.normalize(cb, cb);
        Vec3.set(this.normal, cb[0], cb[1], cb[2]);
    }
}
