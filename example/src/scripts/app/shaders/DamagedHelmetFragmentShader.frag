// #extension GL_OES_standard_derivatives : enable

precision highp float;

// Uniforms
uniform sampler2D uBaseColorTexture;
uniform sampler2D uEmissiveTexture;
uniform sampler2D uMetallicRoughnessTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uOcclusionTexture;

// Position
varying vec3 vPosition;
varying vec4 vWorldPosition;

// Normal
#ifdef HAS_VERTEX_NORMALS
varying vec3 vNormal;
#endif

// Uv
#ifdef HAS_TEXTURE_COORDS
varying vec2 vTextureCoord;
#endif

const float M_PI = 3.141592653589793;
const float MIN_ROUGHNESS = 0.04;

struct PBRInfo {
  float NdotL;
  float NdotV;
  float NdotH;
  float LdotH;
  float perceptualRoughness;
  float metalness;
  vec3 reflectance0;
  vec3 reflectance90;
  float alphaRoughness;
  vec3 diffuseColor;
  vec3 specularColor;
};

vec4 SRGBtoLINEAR(vec4 srgbIn) {
    #ifdef SRGB_FAST_APPROXIMATION
      vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
    #else
      vec3 bLess = step(vec3(0.04045), srgbIn.xyz);
      vec3 linOut = mix(
        srgbIn.xyz / vec3(12.92),
        pow((srgbIn.xyz + vec3(0.055)) / vec3(1.055),
        vec3(2.4)),
        bLess
      );
    #endif

    return vec4(linOut, srgbIn.w);
}

void main(void) {
    // float perceptualRoughness = 0.5;
    // float metallic = 0.5;
    // vec4 metallicRoughnessSample = texture2D(uMetallicRoughnessTexture, vTextureCoord);
    // perceptualRoughness = metallicRoughnessSample.g * perceptualRoughness;
    // metallic = metallicRoughnessSample.b * metallic;

    // vec3 color = vDiffuse;

    // color = texture2D(uMetallicRoughnessTexture, vTextureCoord).rgb;
    // color += texture2D(uNormalTexture, vTextureCoord).rgb;

    vec4 baseColor = SRGBtoLINEAR(texture2D(uBaseColorTexture, vTextureCoord));

    // Albedo
    vec3 color = baseColor.rgb;

    // Emissive
    color += SRGBtoLINEAR(texture2D(uEmissiveTexture, vTextureCoord)).rgb;

    // AO
    float ambientOcclusion = texture2D(uOcclusionTexture, vTextureCoord).r;
    color = mix(color, color * ambientOcclusion, 0.5);

    #ifdef HAS_VERTEX_NORMALS
      vec3 normal = normalize(vNormal);
    #endif

    gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), baseColor.a);
}
