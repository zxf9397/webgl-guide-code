attribute vec4 position;
attribute vec4 color;
attribute vec3 normal;
uniform mat4 camera;
varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_position;
void main() {

  // Apply the camera matrix to the vertex position
  gl_Position = camera * position;

  // Set varying position for the fragment shader 
  v_position = vec3(position.xyz);

  // Set the face normal
  v_normal = normalize(normal);

  // Set the color
  v_color = color;
}