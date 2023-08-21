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
  float d = max(dot(v_normal, lightDir), 0.0);
  if(d > 0.0) {
    vec3 viewVec = vec3(0, 0, 1.0);
    vec3 reflectVec = reflect(-lightDir, normal);
    specular = pow(max(dot(reflectVec, viewVec), 0.0), 120.0);
  }

  gl_FragColor.rgb = vec3(0.4, 0.0, 0.0)     // ambient
  + vec3(0.2, 0.2, 0.2) * d // diffuse + spot
  + specular;               // specular
  gl_FragColor.a = 1.0;
}