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
	const { samplers } = parsedData;
	const { scene } = parsedData;
	const { scenes } = parsedData;
	const { textures } = parsedData;

	const fileRoot = `${document.location.protocol}//${document.location.host}`;
	const filePath = filename.substring(0, filename.lastIndexOf('/'));

	const bufferByteLength = buffers[0].byteLength;
	const meshAttributesData = meshes[0].primitives[0].attributes;

	const textureList = textures.map((data) => {
		return new Texture2D({
			src: `${fileRoot}/${filePath}/${images[data.source].uri}`,
		});
	});

	const meshDataIndices = meshes[0].primitives[0].indices;
	const meshDataNormal = meshAttributesData.NORMAL;
	const meshDataPosition = meshAttributesData.POSITION;
	const meshDataTexcoord = meshAttributesData.TEXCOORD_0;

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
				textures: textureList,
				meshes: geometryData,
			};

			return meshData;
		})
		.catch((error) => {
			console.warn(error);
		});

	return result.then((resultData) => {
		return resultData;
	});

	// const texture0 = new Texture2D({
	// 	src: 'public/assets/textures/example.png',
	// });
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
