attribute vec4 position;
attribute vec4 color;
uniform mat4 camera;
varying vec4 v_color;
void main() {

  // Apply the camera matrix to the vertex position
  gl_Position = camera * position;

  // Set the varying color
  v_color = color;
}