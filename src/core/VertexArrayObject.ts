// Core
import { extensions } from './Capabilities';
import * as Context from './Context';

let gl: WebGLRenderingContext;

export default class VertexArrayObject {
    public vertexArrayObject: any;

    constructor() {
        gl = Context.get();

        if (extensions.vertexArrayObjectExtension) {
            this.vertexArrayObject = extensions.vertexArrayObjectExtension.createVertexArrayOES();
        }
    }

    public bind() {
        if (extensions.vertexArrayObjectExtension) {
            extensions.vertexArrayObject.bindVertexArrayOES(this.vertexArrayObject);
        }
    }

    public unbind() {
        if (extensions.vertexArrayObjectExtension) {
            extensions.vertexArrayObject.bindVertexArrayOES(null);
        }
    }

    public dispose() {
        if (extensions.vertexArrayObjectExtension) {
            extensions.vertexArrayObjectExtension.deleteVertexArrayOES(this.vertexArrayObject);
        }

        this.vertexArrayObject = null;
    }
}
