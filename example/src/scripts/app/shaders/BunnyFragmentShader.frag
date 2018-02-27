precision highp float;

// Uniforms
// uniform sampler2D uTexture0;

// Position
varying vec3 vPosition;
varying vec4 vWorldPosition;

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

vec3 CalculatePointLight(
    vec3 light,
    vec3 normal
) {
    vec3 lightDirection = normalize(light - vWorldPosition.xyz);

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

    float dist = length(light);
    float attenuation = 1.0 / (constant + linear * dist + quadratic * (dist * dist));

    vec3 ambientColor = vec3(0.5);
    float ambientIntensity = 0.5;

    // combine results
    vec3 ambient = (ambientColor * ambientIntensity) * vDiffuse;
    vec3 diffuse = diff * vDiffuse;
    vec3 specular = vec3(0.5) * spec * vec3(1);
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}

void main(void) {
    vec3 color = vDiffuse;
    // color = texture2D(uTexture0, vUv).rgb;

    #ifdef HAS_NORMALS
    vec3 normal = normalize(vNormal);
    #endif

    color += CalculatePointLight(vec3(0.5, 1.0, 2.0), normal);

    gl_FragColor = vec4(color.rgb, 1.0);
}	