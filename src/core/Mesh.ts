// Vendor
import { mat4 } from 'gl-matrix';

// Camera
import Camera from '../camera/Camera';
import OrthographicCamera from '../camera/OrthographicCamera';
import PerspectiveCamera from '../camera/PerspectiveCamera';

// Core
import { extensions } from './Capabilities';
import * as Context from './Context';
import Material from './Material';
import Object3D from './Object3D';
import VertexArrayObject from './VertexArrayObject';

// Geometry
import Geometry from '../geometry/Geometry';

let gl: WebGLRenderingContext;

export default class Mesh extends Object3D {
    public geometry: Geometry;
    public material: Material;
    public vertexArrayObject: VertexArrayObject;
    public visible: boolean;
    public instanceCount: number;
    public isInstanced: boolean;

    constructor(geometry: Geometry, material: Material) {
        super();

        this.geometry = geometry;
        this.material = material;
        this.vertexArrayObject = new VertexArrayObject();
        this.visible = true;
        this.instanceCount = 0;

        if (!this.material.program.created) {
            this.material.create(this.geometry);
        }

        this.isInstanced = false;

        gl = Context.get();

        // Setup vertex array object
        this.vertexArrayObject.bind();
        this.bindAttributes();
        this.bindAttributesInstanced();
        this.bindIndexBuffer();
        this.vertexArrayObject.unbind();
    }

    public setInstanceCount(value: number) {
        gl = Context.get();

        this.instanceCount = value;
        this.isInstanced = true;
    }

    public bindAttributes() {
        // Attributes
        Object.keys(this.geometry.attributes).forEach((attributeName) => {
            if (attributeName !== 'aIndex') {
                // enableVertexAttribArray
                this.material.program.setAttributeLocation(attributeName);

                // Bind buffer
                this.geometry.attributes[attributeName].bind();

                // vertexAttribPointer
                this.material.program.setAttributePointer(
                    attributeName,
                    this.geometry.attributes[attributeName].itemSize,
                );
            }
        });
    }

    public bindAttributesInstanced() {
        // Instanced Attributes
        Object.keys(this.geometry.attributesInstanced).forEach((attributeName) => {
            if (attributeName !== 'aIndex') {
                // enableVertexAttribArray
                this.material.program.setAttributeLocation(attributeName);

                // Bind buffer
                this.geometry.attributesInstanced[attributeName].bind();

                // vertexAttribPointer
                this.material.program.setAttributeInstancedPointer(
                    attributeName,
                    this.geometry.attributesInstanced[attributeName].itemSize,
                );

                extensions.angleInstancedArraysExtension.vertexAttribDivisorANGLE(
                    this.material.program.attributeLocations[attributeName],
                    1,
                );
            }
        });
    }

    public bindIndexBuffer() {
        // Bind index buffer
        if (this.geometry.bufferIndices) {
            this.geometry.attributes.aIndex.bind();
        }
    }

    public draw(camera: Camera | PerspectiveCamera | OrthographicCamera) {
        if (!this.visible) return;
        if (!this.material.program.created) return;

        gl = Context.get();

        // Update ModelMatrix
        this.updateMatrix(camera);
        this.material.program.bind();

        // Enable culling
        if (this.material.culling !== -1) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(this.material.culling);
        }

        this.material.setUniforms(
            camera.projectionMatrix,
            this.modelViewMatrix,
            this.modelMatrix,
            camera,
        );

        if (extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.bind();
        } else {
            this.bindAttributes();
            this.bindAttributesInstanced();
            this.bindIndexBuffer();
        }

        if (this.geometry.attributes.aIndex) {
            gl.drawElements(
                this.material.drawType,
                this.geometry.attributes.aIndex.numItems,
                gl.UNSIGNED_SHORT,
                0,
            );
          } else {
            gl.drawArrays(
                this.material.drawType,
                0,
                this.geometry.attributes.aVertexPosition.numItems,
            );
        }

        if (extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.unbind();
        }

        if (this.material.culling !== -1) {
            gl.disable(gl.CULL_FACE);
        }
    }

    public drawInstance(camera: Camera | PerspectiveCamera | OrthographicCamera) {
        if (!this.visible) return;
        if (!this.material.program.created) return;

        gl = Context.get();

        // Update modelMatrix
        this.updateMatrix(camera);

        this.material.program.bind();
        this.material.setUniforms(
            camera.projectionMatrix,
            this.modelViewMatrix,
            this.modelMatrix,
            camera,
        );

        // Culling enable
        if (this.material.culling !== -1) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(this.material.culling);
        }

        // Blending enable
        if (this.material.blending) {
            gl.enable(gl.BLEND);
            gl.blendFunc(this.material.blendFunc[0], this.material.blendFunc[1]);
        }

        if (extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.bind();
        } else {
            this.bindAttributes();
            this.bindAttributesInstanced();
            this.bindIndexBuffer();
        }

        extensions.angleInstancedArraysExtension.drawElementsInstancedANGLE(
            this.material.drawType,
            this.geometry.attributes.aIndex.numItems,
            gl.UNSIGNED_SHORT,
            0,
            this.instanceCount,
        );

        if (extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject.unbind();
        }

        // Culling disable
        if (this.material.culling !== -1) {
            gl.disable(gl.CULL_FACE);
        }

        // Disable blending
        if (this.material.blending) {
            gl.disable(gl.BLEND);
        }
    }

    public dispose() {
        this.material.dispose();
        this.geometry.dispose();
        this.vertexArrayObject.dispose();
        this.geometry = undefined;
        this.material = undefined;
        super.dispose();
    }
}
