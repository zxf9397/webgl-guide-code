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

  // Initialize a cube
  const [vertices, normals, indices] = cube();

  // Count vertices
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
  gl.vertexAttrib3f(color, 1, 0, 0);

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Set perspective
  const perspectiveLocation = gl.getUniformLocation(program, 'perspective');
  gl.uniformMatrix4fv(
    perspectiveLocation,
    false,
    perspective({ fov: 30, aspect: 1, near: 1, far: 100 }).toFloat32Array()
  );

  // Set camera
  const cameraLocation = gl.getUniformLocation(program, 'camera');
  gl.uniformMatrix4fv(
    cameraLocation,
    false,
    new DOMMatrix().translateSelf(0, 0, -3.5).rotateSelf(0, -30, 0).toFloat32Array()
  );

  // Set light position
  const lightPositionShaderLocation = gl.getUniformLocation(program, 'lightposition');
  gl.uniform3fv(lightPositionShaderLocation, new Float32Array([0, 0, 1.5]));

  // Render
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}
