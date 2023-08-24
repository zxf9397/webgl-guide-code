import vertexSource from './vertex.vs?raw';
import fragmentSource from './fragment.fs?raw';
import { buffer, createContext, createProgram } from '../../utils/fn';
import { perspective } from '../../utils/fn/camera';
import { cube, sphere } from '../../utils/fn/shapes';

export default function render() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

  const gl = createContext(canvas);

  // Link the two shaders into a program
  const program = createProgram(gl, vertexSource, fragmentSource);
  gl.useProgram(program);

  const [vertices, normals, indices] = cube();

  const n = indices.length;

  // Set position, normal buffers
  buffer(gl, vertices, program, 'position', 3, gl.FLOAT);
  buffer(gl, normals, program, 'normal', 3, gl.FLOAT);

  // Set indices
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // Set cube color
  const color = gl.getAttribLocation(program, 'color');
  gl.vertexAttrib3f(color, 1, 1, 1);

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Set the camera
  const cameraMatrix = perspective({ fov: 30, aspect: 1, near: 1, far: 100 });
  cameraMatrix.translateSelf(0, 0, -5).rotateSelf(40, 0, 0).rotateSelf(0, -45, 0);
  const camera = gl.getUniformLocation(program, 'camera');
  gl.uniformMatrix4fv(camera, false, cameraMatrix.toFloat32Array());

  // Set the point light color and position
  const lightColor = gl.getUniformLocation(program, 'lightColor');
  gl.uniform3f(lightColor, 0.8, 0.8, 0.8);
  const lightPosition = gl.getUniformLocation(program, 'lightPosition');
  gl.uniform3f(lightPosition, 1.0, 2.5, 2.0);

  // Set the ambient light color
  const ambientLight = gl.getUniformLocation(program, 'ambientLight');
  gl.uniform3f(ambientLight, 0.3, 0.3, 0.3);

  // Render
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}
