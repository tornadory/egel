// Core
import Texture from '../core/Texture';

// Loaders
import FileLoader from '../loaders/FileLoader';

// Utilities
import { warn } from '../utilities/Console';

export default function GLTFParser(json, filename) {
    const filePath = filename.slice(0, filename.lastIndexOf('/'));

    const fetchGeometry = (gltf) => {
        const fetchedGeometry = gltf.buffers.map((buffer) => {
            FileLoader(`${filePath}/${buffer.uri}`, 'arraybuffer')
                .then((buffer: ArrayBuffer) => parseGeometry(gltf, buffer))
                .catch((error) => {
                    warn(error);
                });
        });
    };

    const parseMeshes = (gltf) => {
        const parsedMeshes = gltf.meshes.map((mesh) => {
            console.log(mesh);
        });
    };

    const parseGeometry = (gltf, buffer) => {
        console.log(gltf, buffer);

        const parsedBufferViews = gltf.bufferViews.map((bufferView) => {
            console.log(bufferView);
        });

        const parsedAccessors = gltf.accessors.map((accessor) => {
            console.log(accessor);
        });
    };

    const parseMaterials = (gltf) => {
        const fetchedTextures = gltf.images.map((image) => {
            const texture = new Texture({
                src: `${filePath}/${image.uri}`,
            });

            return texture;
        });

        const textureTypes = gltf.materials.map((material) => {
            return {
                emissiveTexture: fetchedTextures[material.emissiveTexture.index],
                normalTexture: fetchedTextures[material.normalTexture.index],
                occlusionTexture: fetchedTextures[material.occlusionTexture.index],
                baseColorTexture: fetchedTextures[material.pbrMetallicRoughness.baseColorTexture.index],
                metallicRoughnessTexture: fetchedTextures[material.pbrMetallicRoughness.metallicRoughnessTexture.index],
            };
        });

        const parsedMaterials = textureTypes.map((type, i) => {
            console.log(type);
        });

        return parsedMaterials;
    };

    const meshes = parseMeshes(json);
    const geometry = fetchGeometry(json);
    const materials = parseMaterials(json);
}
