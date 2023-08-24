precision mediump float;
uniform mat4 camera;
uniform vec3 lightposition;
varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;
void main() {
  vec3 normal = normalize(v_normal);
  vec3 lightPosition = vec3(camera * vec4(lightposition, 1) - v_position);
  vec3 lightDir = normalize(lightPosition);
  float lightDist = length(lightPosition);
  float specular = 0.0;
  float nDotL = max(dot(v_normal, lightDir), 0.0);
  if(nDotL > 0.0) {
    vec3 viewVec = vec3(0, 0, 1.0);
    vec3 reflectVec = reflect(-lightDir, normal);
    specular = pow(max(dot(reflectVec, viewVec), 0.0), 120.0);
  }

  vec3 ambientColor = vec3(0.2, 0.2, 0.2);
  vec3 lightColor = vec3(0.6, 0.6, 0.6);

  gl_FragColor.rgb = ambientColor * v_color.rgb     // ambient
  + lightColor * v_color.rgb * nDotL // diffuse + spot
  + specular;               // specular
  gl_FragColor.a = 1.0;
}