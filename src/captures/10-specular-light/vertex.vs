precision mediump float;
uniform mat4 perspective;
uniform mat4 camera;
attribute vec4 position;
attribute vec4 color;
attribute vec3 normal;
varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;
void main() {
  v_position = camera * position;
  gl_Position = perspective * v_position;

  // Now that the camera has a position, we need to apply it to the normal
  // We'll see that in detail in the next chapters
  v_normal = normalize(mat3(camera) * normal);

  v_color = color;
}