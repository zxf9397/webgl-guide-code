import vertexSource from './vertex.vs?raw';
import fragmentSource from './fragment.fs?raw';
import { buffer, createContext, createProgram } from '../../utils/fn';
import { perspective } from '../../utils/fn/camera';
import { cube, sphere } from '../../utils/fn/shapes';
import { transpose } from '../../utils/fn/matrix';

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

  // Set the camera
  const cameraMatrix = perspective({ fov: 30, aspect: 1, near: 1, far: 100 });
  cameraMatrix.translateSelf(0, 0, -5).rotateSelf(30, 0, 0).rotateSelf(0, -30, 0);

  // Set the point light color and position
  const lightColor = gl.getUniformLocation(program, 'lightColor');
  gl.uniform3f(lightColor, 1, 1, 1);

  const lightPosition = gl.getUniformLocation(program, 'lightPosition');
  gl.uniform3f(lightPosition, 1.5, 1.5, 1.5);

  // Set the ambient light color
  const ambientLight = gl.getUniformLocation(program, 'ambientLight');
  gl.uniform3f(ambientLight, 0.1, 0.1, 0.1);

  // Get uniforms used in the loop
  const model = gl.getUniformLocation(program, 'model');
  const mvp = gl.getUniformLocation(program, 'mvp');
  const inverseTranspose = gl.getUniformLocation(program, 'inverseTranspose');

  let cubeAngle = 0;

  // Loop
  setInterval(() => {
    cubeAngle += 0.5;

    // Set the model matrix
    const modelMatrix = new DOMMatrix();
    modelMatrix.rotateSelf(0, cubeAngle, 0);
    gl.uniformMatrix4fv(model, false, modelMatrix.toFloat32Array());

    // Set the cube's mvp matrix (camera x model)
    const mvpMatrix = new DOMMatrix(modelMatrix as any);
    mvpMatrix.preMultiplySelf(cameraMatrix);
    gl.uniformMatrix4fv(mvp, false, mvpMatrix.toFloat32Array());

    // Set the inverse transpose of the model matrix
    let inverseTransposeMatrix = new DOMMatrix(modelMatrix as any);
    inverseTransposeMatrix = transpose(inverseTransposeMatrix.invertSelf());
    gl.uniformMatrix4fv(inverseTranspose, false, inverseTransposeMatrix.toFloat32Array());

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  }, 16);
}
