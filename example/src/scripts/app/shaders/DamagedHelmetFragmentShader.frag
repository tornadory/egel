#extension GL_OES_standard_derivatives: enable

precision highp float;

// Uniforms
uniform vec3 uCameraPosition;
uniform sampler2D uBaseColorTexture;
uniform sampler2D uEmissiveTexture;
uniform sampler2D uMetallicRoughnessTexture;
uniform sampler2D uNormalTexture;
uniform sampler2D uOcclusionTexture;
uniform samplerCube uDiffuseEnvTexture;
uniform samplerCube uSpecularEnvTexture;
uniform sampler2D uBRDFLUT;

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
const vec2 METALLIC_ROUGHNESS_VALUES = vec2(0.15, 1.0);
const float NORMAL_SCALE = 1.0;
const vec3 LIGHT_DIRECTION = vec3(1.0, 0.0, 1.0);
const vec3 LIGHT_COLOR = vec3(1.0, 1.0, 1.0);
const vec4 IBL_AMBIENT_SCALE = vec4(1.0);

struct PBRInfo {
  float NdotL;                  // cos angle between normal and light direction
  float NdotV;                  // cos angle between normal and view direction
  float NdotH;                  // cos angle between normal and half vector
  float LdotH;                  // cos angle between light direction and half vector
  float VdotH;                  // cos angle between view direction and half vector
  float perceptualRoughness;    // roughness value, as authored by the model creator (input to shader)
  float metalness;              // metallic value at the surface
  vec3 reflectance0;            // full reflectance color (normal incidence angle)
  vec3 reflectance90;           // reflectance color at grazing angle
  float alphaRoughness;         // roughness mapped to a more linear change in the roughness
  vec3 diffuseColor;            // color contribution from diffuse lighting
  vec3 specularColor;           // color contribution from specular lighting
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

// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
vec3 diffuse(PBRInfo pbrInputs) {
    return pbrInputs.diffuseColor / M_PI;
}

// Fresnel reflectance term of the spec equation (aka F())
vec3 specularReflection(PBRInfo pbrInputs) {
    return pbrInputs.reflectance0 + (pbrInputs.reflectance90 - pbrInputs.reflectance0) * pow(clamp(1.0 - pbrInputs.VdotH, 0.0, 1.0), 5.0);
}

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4, and we adopt their modifications to
// alphaRoughness as input as originally proposed in [2].
float geometricOcclusion(PBRInfo pbrInputs) {
    float NdotL = pbrInputs.NdotL;
    float NdotV = pbrInputs.NdotV;
    float r = pbrInputs.alphaRoughness;

    float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
    float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
    return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.
float microfacetDistribution(PBRInfo pbrInputs) {
    float roughnessSq = pbrInputs.alphaRoughness * pbrInputs.alphaRoughness;
    float f = (pbrInputs.NdotH * roughnessSq - pbrInputs.NdotH) * pbrInputs.NdotH + 1.0;
    return roughnessSq / (M_PI * f * f);
}

vec3 getNormal() {
  vec3 pos_dx = dFdx(vPosition);
  vec3 pos_dy = dFdy(vPosition);
  vec3 tex_dx = dFdx(vec3(vTextureCoord, 0.0));
  vec3 tex_dy = dFdy(vec3(vTextureCoord, 0.0));
  vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

  vec3 ng = normalize(vNormal);

  t = normalize(t - ng * dot(ng, t));
  vec3 b = normalize(cross(ng, t));
  mat3 tbn = mat3(t, b, ng);

  vec3 n = texture2D(uNormalTexture, vTextureCoord).rgb;
  n = normalize(tbn * ((2.0 * n - 1.0) * vec3(NORMAL_SCALE, NORMAL_SCALE, 1.0)));

  return n;
}

void main(void) {
    float perceptualRoughness = METALLIC_ROUGHNESS_VALUES.y;
    float metallic = METALLIC_ROUGHNESS_VALUES.x;

    vec4 metallicRoughnessSample = texture2D(uMetallicRoughnessTexture, vTextureCoord);
    perceptualRoughness = metallicRoughnessSample.g * perceptualRoughness;
    metallic = metallicRoughnessSample.b * metallic;

    perceptualRoughness = clamp(perceptualRoughness, MIN_ROUGHNESS, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    float alphaRoughness = perceptualRoughness * perceptualRoughness;

    vec4 baseColor = SRGBtoLINEAR(texture2D(uBaseColorTexture, vTextureCoord));

    vec3 f0 = vec3(0.04);
    vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
    diffuseColor *= 1.0 - metallic;
    vec3 specularColor = mix(f0, baseColor.rgb, metallic);

    // Compute reflectance
    float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

    // For typical incident reflectance range (between 4% to 100%) set the grazing reflectance to 100% for typical fresnel effect.
    // For very low reflectance range on highly diffuse objects (below 4%), incrementally reduce grazing reflecance to 0%.
    float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    vec3 specularEnvironmentR0 = specularColor.rgb;
    vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;

    vec3 n = getNormal();
    vec3 v = normalize(uCameraPosition - vPosition);
    vec3 l = normalize(LIGHT_DIRECTION);
    vec3 h = normalize(l + v);
    vec3 reflection = -normalize(reflect(v, n));

    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = abs(dot(n, v)) + 0.001;
    float NdotH = clamp(dot(n, h), 0.0, 1.0);
    float LdotH = clamp(dot(l, h), 0.0, 1.0);
    float VdotH = clamp(dot(v, h), 0.0, 1.0);

    PBRInfo pbrInputs = PBRInfo(
      NdotL,
      NdotV,
      NdotH,
      LdotH,
      VdotH,
      perceptualRoughness,
      metallic,
      specularEnvironmentR0,
      specularEnvironmentR90,
      alphaRoughness,
      diffuseColor,
      specularColor
    );

    // Calculate the shading terms for the microfacet specular shading model
    vec3 F = specularReflection(pbrInputs);
    float G = geometricOcclusion(pbrInputs);
    float D = microfacetDistribution(pbrInputs);

    // Calculation of analytical lighting contribution
    vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInputs);
    vec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);

    // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
    vec3 color = NdotL * LIGHT_COLOR * (diffuseContrib + specContrib);

    // Image based lighting (wihout spherical harmonics)
    vec3 BRDF = texture2D(uBRDFLUT, vec2(NdotV, 1.0 - perceptualRoughness)).rgb;
    vec3 diffuseLight = textureCube(uDiffuseEnvTexture, n).rgb;
    vec3 specularLight = textureCube(uSpecularEnvTexture, reflection).rgb;
    vec3 IBLcolor = (diffuseLight * diffuseColor * IBL_AMBIENT_SCALE.x) + (specularLight * (specularColor * BRDF.x + BRDF.y) * IBL_AMBIENT_SCALE.y);
    color += IBLcolor;

    // Ambient Occlusion
    float ambientOcclusion = texture2D(uOcclusionTexture, vTextureCoord).r;
    color = mix(color, color * ambientOcclusion, 1.0);

    // Emissive
    color += SRGBtoLINEAR(texture2D(uEmissiveTexture, vTextureCoord)).rgb;

    gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), baseColor.a);
}
