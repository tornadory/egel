import { // eslint-disable-line
    FileLoader,
} from 'egel';

import {
    Mesh,
} from 'webgl-obj-loader';

function OBJParser(data) {
    const mesh = new Mesh(data);

    console.log(mesh);

    const meshData = {
        vertices: new Float32Array(mesh.vertices),
        normals: new Float32Array(mesh.vertexNormals),
        indices: new Uint16Array(mesh.indices),
        uvs: new Float32Array(mesh.textures),
    };

    return meshData;
}

export default function OBJLoader(filename) {
    return new Promise((resolve, reject) => {
        FileLoader(filename)
            .then((response) => {
                const data = OBJParser(response);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}