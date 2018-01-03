// Loaders
import FileLoader from './FileLoader';

// Parsers
import OBJParser from '../parsers/OBJParser';

export default function OBJLoader(filename): Promise<any> {
    return new Promise((resolve: (data) => void, reject: (status) => void) => {
        FileLoader(filename)
            .then((response) => {
                const data = OBJParser(response);
                resolve(data);
            })
            .catch(reject);
    });
}
