import vertexSource from './vertex.vs?raw';
import fragmentSource from './fragment.fs?raw';
import { buffer, createContext, createProgram } from '../../utils/fn';

function main() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

  const gl = createContext(canvas);

  // Link the two shaders into a program
  const program = createProgram(gl, vertexSource, fragmentSource);
  gl.useProgram(program);

  // Get shaders attributes and uniforms
  const color = gl.getUniformLocation(program, 'color');
  const translation = gl.getUniformLocation(program, 'translation');
  const rotation = gl.getUniformLocation(program, 'rotation');
  const scale = gl.getUniformLocation(program, 'scale');

  // Set color
  gl.uniform4f(color, 1.0, 0.0, 0.0, 1.0);

  // Set position
  const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  buffer(gl, vertices, program, 'position', 2, gl.FLOAT);

  // Set translation matrix (transposed)
  const Tx = 0.8;
  const Ty = -0.6;
  // prettier-ignore
  const t_matrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0, // col 1
    0.0, 1.0, 0.0, 0.0, // col 2
    0.0, 0.0, 1.0, 0.0, // col 3
    Tx, Ty, 0.0, 1.0 // col 4
  ]);
  gl.uniformMatrix4fv(translation, false, t_matrix);

  // Set rotation matrix (transposed)
  const B = 0.7;
  const cosB = Math.cos(B);
  const sinB = Math.sin(B);
  // prettier-ignore
  const r_matrix = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);
  gl.uniformMatrix4fv(rotation, false, r_matrix);

  // Set scale matrix (transposed)
  const S = 0.4;
  // prettier-ignore
  const s_matrix = new Float32Array([
    S, 0.0, 0.0, 0.0,
    0.0, S, 0.0, 0.0,
    0.0, 0.0, S, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);
  gl.uniformMatrix4fv(scale, false, s_matrix);

  // Set the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Render
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
