attribute vec4 position;
uniform mat4 translation;
uniform mat4 rotation;
uniform mat4 scale;
void main() {
  // Translation, then rotation, then scale
  gl_Position = (scale * (rotation * translation)) * position;
}