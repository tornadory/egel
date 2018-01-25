export const PhysicalFragmentShader = `
    <HOOK_NAME>

    <HOOK_PRECISION>
    <HOOK_DEFINES>

    // Color
    varying vec3 vDiffuse;

    // Position
    varying vec3 vPosition;

    // Normal
    #ifdef HAS_NORMALS
    varying vec3 vNormal;
    #endif

    // Uv
    #ifdef HAS_UVS
    varying vec2 vUv;
    #endif

    <HOOK_FRAGMENT_PRE>

    void main() {
        vec3 color = vDiffuse;

        #ifdef HAS_NORMALS
        vec3 normal = normalize(vNormal);
        #endif

        <HOOK_FRAGMENT_MAIN>

        gl_FragColor = vec4(color.rgb * normal * 0.5 + 0.5, 1.0);

        <HOOK_FRAGMENT_END>
    }
`;
