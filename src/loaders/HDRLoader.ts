// Vendor
import parseHDR from 'parse-hdr';

export class ImageData {
    public width: number;
    public height: number;
    public data: Float32Array;

    constructor(width: number, height: number, data: Float32Array) {
      this.width = width;
      this.height = height;
      this.data = data;
    }
}

export default function HDRLoader(filename): Promise<ImageData> {
    return new Promise((resolve: (image) => void, reject: (status) => void) => {
        fetch(filename)
            .then((response) => response.arrayBuffer())
            .then((buffer) => parseHDR(buffer))
            .then((hdr) => {
                const image = new ImageData(hdr.shape[0], hdr.shape[1], hdr.data);
                resolve(image);
            })
            .catch((error) => {
                reject(error);
            });
    });
}