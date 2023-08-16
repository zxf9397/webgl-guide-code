import vertexSource from './vertex.vs?raw';
import fragmentSource from './fragment.fs?raw';
import { buffer, createContext, createProgram } from '../../utils/fn';
import { perspective } from '../../utils/fn/camera';

function main() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

  const gl = createContext(canvas);

  // Link the two shaders into a program
  const program = createProgram(gl, vertexSource, fragmentSource);
  gl.useProgram(program);

  // Create a cube
  //
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  // prettier-ignore
  const verticesColors = new Float32Array([
     1.0,  1.0,  1.0,
     1.0,  1.0,  1.0, // v0 white
    -1.0,  1.0,  1.0,
     1.0,  0.0,  1.0, // v1 magenta
    -1.0, -1.0,  1.0,
     1.0,  0.0,  0.0, // v2 red
     1.0, -1.0,  1.0,
     1.0,  1.0,  0.0, // v3 yellow
     1.0, -1.0, -1.0,
     0.0,  1.0,  0.0, // v4 green
     1.0,  1.0, -1.0,
     0.0,  1.0,  1.0, // v5 cyan
    -1.0,  1.0, -1.0,
     0.0,  0.0,  1.0, // v6 blue
    -1.0, -1.0, -1.0,
     0.0,  0.0,  0.0, // v7 black
  ]);

  // Indices of the vertices for each triangle
  // prettier-ignore
  const indices = new Uint8Array([
    0, 1, 2,
    0, 2, 3, // front
    0, 3, 4,
    0, 4, 5, // right
    0, 5, 6,
    0, 6, 1, // up
    1, 6, 7,
    1, 7, 2, // left
    7, 4, 3,
    7, 3, 2, // down
    4, 7, 6,
    4, 6, 5, // back
  ]);

  // Number of vertices
  const n = 36;

  // Create a buffer object for vertices / colors
  const vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  // Create a buffer object for indexes
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // Bytes per float (4)
  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // Set attributes and uniforms
  const position = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(position);
  const color = gl.getAttribLocation(program, 'color');
  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(color);

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Set camera perspective and position
  const camera = gl.getUniformLocation(program, 'camera');
  const cameraMatrix = perspective({ fov: 30, aspect: 1, near: 1, far: 100 });
  cameraMatrix.translateSelf(0, 0, -5);

  // Update camera angle and re-render triangles every 16ms
  setInterval(() => {
    cameraMatrix.rotateSelf(0.4, 0.8, 0.4);
    gl.uniformMatrix4fv(camera, false, cameraMatrix.toFloat32Array());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  }, 16);
}

main();
