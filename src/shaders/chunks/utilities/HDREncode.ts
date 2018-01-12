export const HDREncode = `
    vec4 HDREncode(vec4 color) {
        #if defined(RGBM_ENCODE) || defined(RGBM)
            return RGBMEncode(color.xyz, 51.5);
        #else
            return color;
        #endif
    }
`;
