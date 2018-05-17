import { // eslint-disable-line
	FileLoader,
} from 'egel';

function SHParser(data, exponent = 1.0) {
	const sqrtPI = Math.sqrt(Math.PI);
	const C0 = 1.0 / (2 * sqrtPI);
	const C1 = Math.sqrt(3)  / (3 * sqrtPI);
	const C2 = Math.sqrt(15) / (8 * sqrtPI);
	const C3 = Math.sqrt(5)  / (16 * sqrtPI);
	const C4 = 0.5 * C2;

	return Float32Array.from([
		// R
		exponent * (C1 * data[2 * 3 + 0]),
		exponent * (-C1 * data[1 * 3 + 0]),
		exponent * (-C1 * data[3 * 3 + 0]),
		exponent * (C0 * data[0 * 3 + 0] - C3 * data[6 * 3 + 0]),

		//  G
		exponent * (C1 * data[2 * 3 + 1]),
		exponent * (-C1 * data[1 * 3 + 1]),
		exponent * (-C1 * data[3 * 3 + 1]),
		exponent * (C0 * data[0 * 3 + 1] - C3 * data[6 * 3 + 1]),

		//  B
		exponent * (C1 * data[2 * 3 + 2]),
		exponent * (-C1 * data[1 * 3 + 2]),
		exponent * (-C1 * data[3 * 3 + 2]),
		exponent * (C0 * data[0 * 3 + 2] - C3 * data[6 * 3 + 2]),
		exponent * (C2 * data[4 * 3 + 0]),
		exponent * (-C2 * data[5 * 3 + 0]),
		exponent * (3 * C3 * data[6 * 3 + 0]),
		exponent * (-C2 * data[7 * 3 + 0]),
		exponent * (C2 * data[4 * 3 + 1]),
		exponent * (-C2 * data[5 * 3 + 1]),
		exponent * (3 * C3 * data[6 * 3 + 1]),
		exponent * (-C2 * data[7 * 3 + 1]),
		exponent * (C2 * data[4 * 3 + 2]),
		exponent * (-C2 * data[5 * 3 + 2]),
		exponent * (3 * C3 * data[6 * 3 + 2]),
		exponent * (-C2 * data[7 * 3 + 2]),
		exponent * (C4 * data[8 * 3 + 0]),
		exponent * (C4 * data[8 * 3 + 1]),
		exponent * (C4 * data[8 * 3 + 2]),
		exponent * (1),
	]);
}

export default function SHLoader(filename) {
    return new Promise((resolve, reject) => {
        FileLoader(filename, 'arraybuffer')
            .then((response) => {
				const data = SHParser(new Float32Array(response, 0, 27));
				resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
