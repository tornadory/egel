// Vendor
import HDRParser from 'parse-hdr';

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
        const request = new XMLHttpRequest();
        // Use fetch
    });
}
