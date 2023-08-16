attribute vec4 position;
attribute vec2 texCoord;
varying vec2 v_texCoord;
void main() {
  gl_Position = position;
  v_texCoord = texCoord;
}