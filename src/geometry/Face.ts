// Vendor
import { vec3 } from 'gl-matrix';

const cb = vec3.create();
const ab = vec3.create();

export default class Face {
    public indices: number[];
    public vertices: vec3[];
    public uvs: number[];
    public normal: vec3;

    constructor(
        indiceA: number,
        indiceB: number,
        indiceC: number,
        vertexA: vec3,
        vertexB: vec3,
        vertexC: vec3,
    ) {
        this.indices = [indiceA, indiceB, indiceC];
        this.vertices = [vertexA, vertexB, vertexC];
        this.uvs = [indiceA, indiceB, indiceC];
        this.normal = vec3.create();
        this.updateFaceNormal();
    }

    public updateFaceNormal() {
        vec3.set(cb, 0, 0, 0);
        vec3.set(ab, 0, 0, 0);
        vec3.subtract(cb, this.vertices[2], this.vertices[1]);
        vec3.subtract(ab, this.vertices[0], this.vertices[1]);
        vec3.cross(cb, cb, ab);
        vec3.normalize(cb, cb);
        vec3.set(this.normal, cb[0], cb[1], cb[2]);
    }
}
