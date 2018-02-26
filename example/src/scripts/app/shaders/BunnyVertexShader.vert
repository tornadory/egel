// Uniforms
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

// Position
attribute vec3 aVertexPosition;

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

    #ifdef HAS_UVS
    vUv = aUv;
    #endif

    #ifdef HAS_NORMALS
    vNormal = uNormalMatrix * aVertexNormal;
    #endif

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}