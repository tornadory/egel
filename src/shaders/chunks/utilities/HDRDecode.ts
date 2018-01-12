export const HDRDecode = `
    vec4 HDRDecode(vec4 color) {
        #if defined(RGBM_DECODE) || defined(RGBM)
            return vec4(RGBMDecode(color, 51.5), 1.0);
        #else
            return color;
        #endif
    }
`;
