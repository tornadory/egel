import { // eslint-disable-line
	FileLoader,
	Texture2D,
} from 'egel';

function GLTFParser(filename, data) {
	const parsedData = JSON.parse(data);
	const { accessors } = parsedData;
	const { bufferViews } = parsedData;
	const { buffers } = parsedData;
	const { images } = parsedData;
	const { materials } = parsedData;
	const { meshes } = parsedData;
	const { nodes } = parsedData;
	const { textures } = parsedData;

	const fileRoot = `${document.location.protocol}//${document.location.host}`;
	const filePath = filename.substring(0, filename.lastIndexOf('/'));

	const meshAttributesData = meshes[0].primitives[0].attributes;

	const textureList = textures.map(textureData => new Texture2D({
		src: `${fileRoot}/${filePath}/${images[textureData.source].uri}`,
	}));

	// Geometry data
	const meshDataIndicesIndex = meshes[0].primitives[0].indices;
	const meshDataNormalIndex = meshAttributesData.NORMAL;
	const meshDataPositionIndex = meshAttributesData.POSITION;
	const meshDataTexcoordIndex = meshAttributesData.TEXCOORD_0;

	// console.log(data);

	// Texture data
	const textureDataBaseIndex = materials[0].pbrMetallicRoughness.baseColorTexture.index;
	const textureDataNormalIndex = materials[0].normalTexture.index;
	const textureDataMetallicRoughnessIndex = materials[0].pbrMetallicRoughness.metallicRoughnessTexture.index;
	const textureDataEmissiveIndex = materials[0].emissiveTexture.index;
	const textureDataOcclusionIndex = materials[0].occlusionTexture.index;

	const meshList = accessors.map((accessor, i) => {
		// Load binary
		return new Promise((resolve, reject) => {
			FileLoader(`${fileRoot}/${filePath}/${buffers[0].uri}`, 'arraybuffer')
				.then((bin) => {
					const bufferViewData = bufferViews[accessor.bufferView];
					const slicedBuffer = bin.slice(
						bufferViewData.byteOffset,
						bufferViewData.byteOffset + bufferViewData.byteLength,
					);

					let bufferData;

					if (accessor.componentType === 5126) {
						bufferData = new Float32Array(slicedBuffer);
					} else if (accessor.componentType === 5123) {
						bufferData = new Uint16Array(slicedBuffer);
					} else {
						console.warn('componentType is unknown');
					}

					resolve(bufferData);
				})
				.catch((error) => {
					reject(error);
				});
		});
	});

	const result = Promise.all(meshList.map(bin => bin))
		.then((geometryData) => {
			const meshData = {
				textures: {
					baseColorTexture: textureList[textureDataBaseIndex],
					metallicRoughnessTexture: textureList[textureDataMetallicRoughnessIndex],
					emissiveTexture: textureList[textureDataEmissiveIndex],
					occlusionTexture: textureList[textureDataOcclusionIndex],
					normalTexture: textureList[textureDataNormalIndex],
				},
				meshes: {
					rotation: nodes[0].rotation,
					vertices: geometryData[meshDataPositionIndex],
					normals: geometryData[meshDataNormalIndex],
					indices: geometryData[meshDataIndicesIndex],
					uvs: geometryData[meshDataTexcoordIndex],
				},
			};

			return meshData;
		})
		.catch((error) => {
			console.warn(error);
		});

	return result.then((resultData) => {
		return resultData;
	});
}

export default function GLTFLoader(filename) {
    return new Promise((resolve, reject) => {
        FileLoader(filename)
            .then((response) => {
				const data = GLTFParser(filename, response);
				data.then(result => resolve(result));
            })
            .catch((error) => {
                reject(error);
            });
    });
}
