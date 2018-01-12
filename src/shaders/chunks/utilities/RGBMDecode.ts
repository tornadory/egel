// http://graphicrants.blogspot.com/2009/04/rgbm-color-encoding.html

export const RGBMDecode = `
    vec3 RGBMDecode(vec4 rgbm, float range) {
        return range * rgbm.rgb * rgbm.a;
    }
`;
