export function addLineNumbers(str) {
    const lines = str.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
        lines[i] = `${(i + 1)}: ${lines[i]}`;
    }

    return lines.join('\n');
};
