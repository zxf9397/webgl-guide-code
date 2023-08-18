import vertexSource from './vertex.vs?raw';
import fragmentSource from './fragment.fs?raw';
import { createContext, createProgram } from '../../utils/fn';

export default function render() {
  // Get A WebGL context
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

  const gl = createContext(canvas);

  // Compile program
  const program = createProgram(gl, vertexSource, fragmentSource);
  gl.useProgram(program);

  // Get shaders attributes and uniforms
  const position = gl.getAttribLocation(program, 'position');

  const color = gl.getUniformLocation(program, 'color');

  // Set color
  gl.uniform4f(color, 0.9, 0.5, 0.1, 1);

  // Fill a buffer with a list of x/y/z coordinates,
  // and pass them to the position attribute of the vertex shader
  // prettier-ignore
  const vertices = new Float32Array([
     0,   0.5, 0, // point 1
    -0.5,-0.5, 0, // point 2
     0.5,-0.5, 0, // point 3
    //  0.5, 0.5, 0, // point 4
    //  0,   0.5, 0, // point 5
    //  0.5,-0.5, 0, // point 6
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    position, // target
    3, // chunk size (send the values 3 by 3)
    gl.FLOAT, // type
    false, // normalize
    0, // stride
    0 // offset
  );
  gl.enableVertexAttribArray(position);

  // Set the clear color (black)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Render
  gl.drawArrays(
    gl.TRIANGLES, // mode
    0, // start
    vertices.length // count
  );
}
