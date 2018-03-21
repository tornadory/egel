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

// Color
varying vec3 vDiffuse;

// Normal
#ifdef HAS_VERTEX_NORMALS
varying vec3 vNormal;
#endif

// Uv
#ifdef HAS_TEXTURE_COORDS
varying vec2 vTextureCoord;
#endif

vec3 CalculatePointLight(
    vec3 lightPosition,
    vec3 ambientColor,
    float ambientIntensity,
    vec3 specularColor,
    vec3 specularIntensity,
    vec3 normal
) {
    vec3 lightDirection = normalize(lightPosition - vWorldPosition.xyz);

    // diffuse shading
    float diff = max(dot(normal, lightDirection), 0.0);

    // specular shading
    vec3 reflectDirection = reflect(-lightDirection, normal);

    // Fix the spec from showing on the backside by multiplying it by the lambert term
    float spec = diff * pow(max(dot(lightDirection, reflectDirection), 0.0), 0.25);

    // attenuation
    float constant = 1.0;
    float linear = 0.09;
    float quadratic = 0.032;

    float dist = length(lightPosition);
    float attenuation = 1.0 / (constant + linear * dist + quadratic * (dist * dist));

    // combine results
    vec3 ambient = (ambientColor * ambientIntensity) * vDiffuse;
    vec3 diffuse = diff * vDiffuse;
    vec3 specular = specularColor * spec * specularIntensity;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}

void main(void) {
    vec3 color = vDiffuse;
    color = texture2D(uNormalTexture, vTextureCoord).rgb;

    #ifdef HAS_VERTEX_NORMALS
    vec3 normal = normalize(vNormal);
    #endif

    color += CalculatePointLight(
        vec3(0.5, 1.0, 2.0), // lightPosition
        vec3(1.0, 0.73, 0.5), // ambientColor
        0.5, // ambientIntensity
        vec3(0.25), // specularColor
        vec3(1), // specularIntensity
        normal
    );

    gl_FragColor = vec4(color, 1.0);
}
