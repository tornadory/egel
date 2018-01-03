// Vendor
import OBJ from 'webgl-obj-loader';

export default function(data) {
    const mesh = new OBJ.Mesh(data);

    return {
        vertices: new Float32Array(mesh.vertices),
        normals: new Float32Array(mesh.vertexNormals),
        indices: new Uint16Array(mesh.indices),
        uvs: new Float32Array(mesh.textures),
    };
}