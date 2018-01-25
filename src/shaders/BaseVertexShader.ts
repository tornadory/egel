export const BaseVertexShader = `
    <HOOK_NAME>

    <HOOK_PRECISION>
    <HOOK_DEFINES>

    // Position
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat3 uNormalMatrix;
    attribute vec3 aVertexPosition;
    varying vec3 vPosition;
    varying vec4 vWorldPosition;

    // Camera
    uniform vec3 uCameraPosition;

    #ifdef HAS_VERTEX_COLORS
    attribute vec3 aVertexColor;
    #endif

    // Color
    uniform vec3 uDiffuse;
    varying vec3 vDiffuse;

    // Normal
    #ifdef HAS_NORMALS
    attribute vec3 aVertexNormal;
    varying vec3 vNormal;
    #endif

    // Uv
    #ifdef HAS_UVS
    attribute vec2 aUv;
    varying vec2 vUv;
    #endif

    <HOOK_VERTEX_PRE>

    void main() {
        vDiffuse = uDiffuse;

        // Override for custom positioning
        vec3 transformed = vec3(0.0);

        #ifdef HAS_VERTEX_COLORS
        vDiffuse = aVertexColor;
        #endif

        #ifdef HAS_UVS
        vUv = aUv;
        #endif

        <HOOK_VERTEX_MAIN>

        #ifdef HAS_NORMALS
        vNormal = uNormalMatrix * aVertexNormal;
        #endif

        // Vertex position + offset
        vPosition = aVertexPosition + transformed;

        // Calculate world position of vertex with transformed
        vWorldPosition = uModelMatrix * vec4(aVertexPosition + transformed, 1.0);

        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vPosition, 1.0);

        <HOOK_VERTEX_END>
    }
`;
