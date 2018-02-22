precision highp float;

// Uniforms
uniform sampler2D uTexture0;

// Position
varying vec3 vPosition;

// Color
varying vec3 vDiffuse;

// Normal
#ifdef HAS_NORMALS
varying vec3 vNormal;
#endif

// Uv
#ifdef HAS_UVS
varying vec2 vUv;
#endif

void main(void) {
    vec3 color = vDiffuse;
    color = texture2D(uTexture0, vUv).rgb;

    #ifdef HAS_NORMALS
    vec3 normal = normalize(vNormal);
    #endif

    gl_FragColor = vec4(color.rgb * normal, 1.0);
}	