// Loaders
import FileLoader from './FileLoader';

// Parsers
import OBJParser from '../parsers/OBJParser';

export default function(filename) {
    return new Promise((resolve, reject) => {
        FileLoader(filename)
            .then((response) => {
                const data = OBJParser(response);
                resolve(data);
            })
            .catch(reject);
    });
}
