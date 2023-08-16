precision mediump float;
uniform sampler2D sampler;
varying vec2 v_texCoord;
void main() {
  gl_FragColor = texture2D(sampler, v_texCoord);
}