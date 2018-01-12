export const floatEncode = `
    vec4 encodeFloat(const in float depth) {
        const vec4 bitShifts = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);
        const vec4 bit_mask  = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);

        vec4 res = fract(depth * bitShifts);
        res -= res.xxyz * bit_mask;

        return res;
    }
`;
