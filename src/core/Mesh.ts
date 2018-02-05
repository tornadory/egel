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

    constructor(geometry: Geometry, material: Material) {
        super();

        this.geometry = geometry;
        this.material = material;
        this.vertexArrayObject = new VertexArrayObject();
        this.visible = true;

        if (!this.material.program.created) {
            this.material.create(this.geometry);
        }

        gl = Context.get();

        // Setup vertex array object
        this.vertexArrayObject.bind();
        this.bindAttributes();
        this.bindIndexBuffer();
        this.vertexArrayObject.unbind();
    }

    public bindAttributes() {
        // Attributes
        Object.keys(this.geometry.attributes).forEach((attributeName) => {
            if (attributeName !== 'aVertexIndex') {
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

    public bindIndexBuffer() {
        // Bind index buffer
        if (this.geometry.bufferIndices) {
            this.geometry.attributes.aVertexIndex.bind();
        }
    }

    public draw(camera: Camera | PerspectiveCamera | OrthographicCamera) {
        if (!this.visible) return;
        if (!this.material.program.created) return;

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
            this.bindIndexBuffer();
        }

        if (this.geometry.attributes.aVertexIndex) {
            gl.drawElements(
                this.material.drawType,
                this.geometry.attributes.aVertexIndex.numItems,
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

    public dispose() {
        this.material.dispose();
        this.geometry.dispose();
        this.vertexArrayObject.dispose();
        this.geometry = undefined;
        this.material = undefined;

        super.dispose();
    }
}
