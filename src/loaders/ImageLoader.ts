export default function ImageLoader(src): Promise<HTMLImageElement> {
    return new Promise((resolve: (image) => void, reject: (status) => void) => {
        const image = new Image();

        image.onload = () => {
            resolve(image);
        };

        image.onerror = () => {
            reject(console.warn(`Failed to load: ${src}`));
        };

        image.src = src;
    });
}
