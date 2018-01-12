export const floatEncode = `
    float decodeFloat(const in vec4 color) {
        const vec4 bitShifts = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);
        return dot(color, bitShifts);
    }
`;
