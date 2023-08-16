import vertexSource from './vertex.vs?raw';
import fragmentSource from './fragment.fs?raw';
import { createContext, createProgram } from '../../utils/fn';

function main() {
  // Get A WebGL context
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

  const gl = createContext(canvas);

  // Link the two shaders into a program
  const program = createProgram(gl, vertexSource, fragmentSource);

  gl.useProgram(program);

  // Select the position attribute and set its X/Y/Z values
  const position = gl.getAttribLocation(program, 'position');
  gl.vertexAttrib4f(position, 0, 0, 0, 1);

  // Select the size attribute and set its value
  const size = gl.getAttribLocation(program, 'size');
  gl.vertexAttrib1f(size, 10);

  // Select the color uniform and set its value
  const color = gl.getUniformLocation(program, 'color');
  gl.uniform4f(color, 1, 0, 0, 1);

  // Set the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Render
  setInterval(() => {
    gl.vertexAttrib4f(position, +Math.random().toFixed(2), +Math.random().toFixed(2), 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
  }, 500);
}

main();
