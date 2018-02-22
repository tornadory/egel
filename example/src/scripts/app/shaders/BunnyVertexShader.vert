// Uniforms
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

// Position
attribute vec3 aVertexPosition;
varying vec3 vPosition;
varying vec4 vWorldPosition;

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

void main(void) {
    vDiffuse = uDiffuse;

    // Override for custom positioning
    vec3 transformed = vec3(0.0);

    #ifdef HAS_UVS
    vUv = aUv;
    #endif

    #ifdef HAS_NORMALS
    vNormal = uNormalMatrix * aVertexNormal;
    #endif

    // Vertex position + offset
    vPosition = aVertexPosition + transformed;

    // Calculate world position of vertex with transformed
    vWorldPosition = uModelMatrix * vec4(aVertexPosition, 1.0);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vPosition, 1.0);
}