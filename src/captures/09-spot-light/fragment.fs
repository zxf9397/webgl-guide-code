precision mediump float;
uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientLight;
varying vec3 v_normal;
varying vec3 v_position;
varying vec4 v_color;
uniform vec3 spotDirection;
uniform float spotAngle;

void main() {

  // Compute direction between the point light and the current fragment
  vec3 lightDirection = normalize(lightPosition - v_position);

  // Compute angle between the face normal and that direction
  float nDotL = max(dot(lightDirection, v_normal), 0.0);

  // Compute distance from light to fragment
  float distance = length(lightPosition - v_position);

  // Compute light attenuation (3.0 / distance), clamped between 0 and 1.
  // The value 3.0 is freely editable and means that anything up to 3 units away from the light is fully lighted.
  float attenuation = clamp(3.0 / distance, 0.0, 1.0);

  // Compute ambient light
  vec3 ambient = ambientLight * v_color.rgb;

  // Compute diffuse light
  vec3 diffuse = vec3(0.0, 0.0, 0.0);
  float dotSpotLight = dot(normalize(spotDirection), -normalize(lightDirection));

  // Apply the diffuse light inside the spot's "field of view"
  if(dotSpotLight > spotAngle) {
    diffuse = lightColor * v_color.rgb * nDotL;
  }
  // Outside of the spot's fov, also apply the diffuse light, but attenuated (optional)
  else {
    // Compute diffuse light proportional to this angle
    diffuse = lightColor * v_color.rgb * nDotL * vec3(0.5, 0.5, 0.5);
  }

  // Compute total light (diffuse + ambient)
  gl_FragColor = vec4(attenuation * diffuse + ambient, 1.0);
}