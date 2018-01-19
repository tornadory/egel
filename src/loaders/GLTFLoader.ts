// Loaders
import FileLoader from './FileLoader';

// Parsers
import GLTFParser from '../parsers/GLTFParser';

export default function GLTFLoader(filename): Promise<any> {
    return new Promise((resolve: (data) => void, reject: (status) => void) => {
        FileLoader(filename)
            .then((response: string) => {
                const data = GLTFParser(response);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
