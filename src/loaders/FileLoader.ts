export default function FileLoader(url: string, responseType?): Promise<any> {
    return new Promise((resolve: (response, status) => void, reject: (status) => void) => {
        const request = new XMLHttpRequest();

        request.responseType = responseType || '';
        request.onreadystatechange = () => {
            if (request.readyState !== 4) return;

            if (request.readyState === 4 && request.status === 200) {
                resolve(request.response, request.status);
            } else {
                reject(request.status);
            }
        };

        request.open('GET', url, true);
        request.send();
    });
}
