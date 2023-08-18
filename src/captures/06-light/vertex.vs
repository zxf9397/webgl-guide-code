attribute vec4 position;
attribute vec4 color;
attribute vec3 normal;
uniform mat4 camera;
uniform vec3 lightColor;
uniform vec3 lightDirection;
varying vec4 v_color;
void main() {

  // Apply the camera matrix to the vertex position
  gl_Position = camera * position;

  // Compute angle between the normal and that direction
  float nDotL = max(dot(lightDirection, normalize(normal)), 0.0);

  // Compute diffuse light proportional to this angle
  vec3 diffuse = lightColor * color.rgb * nDotL;

  // Set the varying color
  v_color = vec4(diffuse, 1.0);
}