// Uniforms
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

// Position
attribute vec3 aVertexPosition;
varying vec3 vPosition;
varying vec4 vWorldPosition;

// Normal
#ifdef HAS_VERTEX_NORMALS
attribute vec3 aVertexNormal;
varying vec3 vNormal;
#endif

// Texture coordinates
#ifdef HAS_TEXTURE_COORDS
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
#endif

void main(void) {
    #ifdef HAS_TEXTURE_COORDS
    vTextureCoord = aTextureCoord;
    #endif

    #ifdef HAS_VERTEX_NORMALS
    vNormal = uNormalMatrix * aVertexNormal;
    #endif

    // Vertex position
    vPosition = aVertexPosition;

    // Calculate world position of vertex
    vWorldPosition = uModelMatrix * vec4(aVertexPosition, 1.0);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vPosition, 1.0);
}
