import { // eslint-disable-line
	Geometry,
} from 'egel';

export default class PlaneGeometry extends Geometry {
    constructor(width, height, subdivisionsX, subdivisionsY) {
		let vertices = [];
		const indices = [];
		let normals = [];
		let uvs = [];
		let index = 0;

		const spacerX = width / subdivisionsX;
		const spacerY = height / subdivisionsY;
		const offsetX = -width * 0.5;
		const offsetY = -height * 0.5;
		const spacerU = 1 / subdivisionsX;
		const spacerV = 1 / subdivisionsY;

		for (let y = 0; y < subdivisionsY; y += 1) {
			for (let x = 0; x < subdivisionsX; x += 1) {
				const triangleX = spacerX * x + offsetX;
				const triangleY = spacerY * y + offsetY;

				const u = x / subdivisionsX;
				const v = y / subdivisionsY;

				vertices = vertices.concat([triangleX, triangleY, 0]);
				vertices = vertices.concat([triangleX + spacerX, triangleY, 0]);
				vertices = vertices.concat([triangleX + spacerX, triangleY + spacerY, 0]);
				vertices = vertices.concat([triangleX, triangleY + spacerY, 0]);

				normals = normals.concat([0, 0, 1]);
				normals = normals.concat([0, 0, 1]);
				normals = normals.concat([0, 0, 1]);
				normals = normals.concat([0, 0, 1]);

				uvs = uvs.concat([u, v]);
				uvs = uvs.concat([u + spacerU, v]);
				uvs = uvs.concat([u + spacerU, v + spacerV]);
				uvs = uvs.concat([u, v + spacerV]);

				indices.push(index * 4 + 0);
				indices.push(index * 4 + 1);
				indices.push(index * 4 + 2);
				indices.push(index * 4 + 0);
				indices.push(index * 4 + 2);
				indices.push(index * 4 + 3);

				index += 1;
			}
		}

		super(
			new Float32Array(vertices),
			new Uint16Array(indices),
			new Float32Array(normals),
			new Float32Array(uvs),
		);
    }
}
