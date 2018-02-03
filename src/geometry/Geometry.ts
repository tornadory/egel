// Vendor
import {
    vec2 as Vec2,
    vec3 as Vec3,
} from 'gl-matrix';

// Core
import * as Context from '../core/Context';

// Geometry
import BufferAttribute from './BufferAttribute';
import Face from './Face';

// Utilities
import { flatten } from '../utilities/Methods';

let gl: WebGLRenderingContext;

export default class Geometry {
    public bufferVertices: Float32Array;
    public bufferIndices: Uint16Array;
    public bufferNormals: Float32Array;
    public bufferUvs: Float32Array;
    public bufferColors: Float32Array;
    public attributes: any;
    public vertices: Vec3[];
    public faces: Face[];
    public uvs: Vec2[];

    constructor(
        vertices: Float32Array,
        indices?: any, // Uint16Array | Uint32Array, (typings are wrong for createBuffer)
        normals?: Float32Array,
        uvs?: Float32Array,
        colors?: Float32Array,
    ) {
        gl = Context.get();

        this.bufferVertices = vertices;
        this.bufferIndices = indices;
        this.bufferNormals = normals;
        this.bufferUvs = uvs;
        this.bufferColors = colors;

        this.attributes = {};

        // Vertex positions
        if (this.bufferVertices) {
            this.addAttribute(
                'aVertexPosition',
                gl.ARRAY_BUFFER,
                this.bufferVertices,
                3,
            );

            this.generateVertices();
        }

        // Vertex indices
        if (this.bufferIndices) {
            this.addAttribute(
                'aIndex',
                gl.ELEMENT_ARRAY_BUFFER,
                this.bufferIndices,
                1,
                false,
            );

            this.generateFaces();
        }

        // Vertex normals
        if (this.bufferNormals) {
            this.addAttribute(
                'aVertexNormal',
                gl.ARRAY_BUFFER,
                this.bufferNormals,
                3,
            );
        }

        // Uvs
        if (this.bufferUvs) {
            this.addAttribute('aUv', gl.ARRAY_BUFFER, this.bufferUvs, 2);
            this.generateUvs();
        }

        // Vertex colors
        if (this.bufferColors) {
            this.addAttribute('aVertexColor', gl.ARRAY_BUFFER, this.bufferColors, 3);
        }
    }

    public addAttribute(
        name: string,
        type: GLenum,
        data: Float32Array | Uint16Array,
        count: number,
        shaderAttribute?: boolean,
    ) {
        this.attributes[name] = new BufferAttribute(
            type,
            data,
            count,
            shaderAttribute,
        );
    }

    public generateVertices() {
        this.vertices = [];

        for (let i = 0; i < this.bufferVertices.length; i += 3) {
            const a = this.bufferVertices[i];
            const b = this.bufferVertices[i + 1];
            const c = this.bufferVertices[i + 2];
            const vertex = Vec3.fromValues(a, b, c);
            this.vertices.push(vertex);
        }
    }

    public generateFaces() {
        this.faces = [];

        for (let i = 0; i < this.bufferIndices.length; i += 3) {
            const ia = this.bufferIndices[i];
            const ib = this.bufferIndices[i + 1];
            const ic = this.bufferIndices[i + 2];
            const a = this.vertices[ia];
            const b = this.vertices[ib];
            const c = this.vertices[ic];
            const face = new Face(ia, ib, ic, a, b, c);
            this.faces.push(face);
        }
    }

    public generateUvs() {
        this.uvs = [];

        for (let i = 0; i < this.bufferUvs.length; i += 2) {
            const a = this.bufferUvs[i];
            const b = this.bufferUvs[i + 1];
            const uv = Vec2.fromValues(a, b);
            this.uvs.push(uv);
        }
    }

    public updateVertices() {
        this.vertices.forEach((vertex, i) => {
            this.bufferVertices.set(vertex, i * vertex.length);
        });

        this.attributes.aVertexPosition.update(this.bufferVertices);
    }

    public updateNormals() {
        const normals = [];

        this.faces.forEach((face) => {
            face.updateFaceNormal();
            normals[face.indices[0]] = face.normal;
            normals[face.indices[1]] = face.normal;
            normals[face.indices[2]] = face.normal;
        });

        this.bufferNormals.set(flatten(normals));
        this.attributes.aVertexNormal.update(this.bufferNormals);
    }

    public dispose() {
        // Dispose attributes and buffers
        Object.keys(this.attributes).forEach((attributeName) => {
            this.attributes[attributeName].dispose(gl);
            this.attributes[attributeName] = undefined;
        });

        this.attributes = undefined;
        this.bufferVertices = undefined;
        this.bufferIndices = undefined;
        this.bufferNormals = undefined;
        this.bufferUvs = undefined;
        this.bufferColors = undefined;
    }
}
