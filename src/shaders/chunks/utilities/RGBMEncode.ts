// http://graphicrants.blogspot.com/2009/04/rgbm-color-encoding.html

export const RGBMEncode = `
    vec4 RGBMEncode(vec3 color, float range) {
        if (dot(color, color) == 0.0) {
            return vec4(0.0);
        }

        vec4 rgbm;

        color /= range;
        rgbm.a = clamp(max(max(color.r, color.g), max(color.b, 1e-6)), 0.0, 1.0);
        rgbm.a = ceil(rgbm.a * 255.0) / 255.0;
        rgbm.rgb = color / rgbm.a;

        return rgbm;
    }
`;
