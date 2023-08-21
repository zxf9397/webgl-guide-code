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
  cameraMatrix.translateSelf(0, 0, -12);

  // Set the point light color and position
  const lightColor = gl.getUniformLocation(program, 'lightColor');
  gl.uniform3f(lightColor, 1, 1, 1);

  const lightPosition = gl.getUniformLocation(program, 'lightPosition');
  gl.uniform3f(lightPosition, 0, 0, 2.5);

  // Set the ambient light color
  const ambientLight = gl.getUniformLocation(program, 'ambientLight');
  gl.uniform3f(ambientLight, 0.3, 0.3, 0.3);

  // Clear
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Render a cube
  const renderCube = (tx: number, ty: number, tz: number, sx: number, sy: number, sz: number) => {
    // Set the model matrix
    const modelMatrix = new DOMMatrix();
    modelMatrix.translateSelf(tx, ty, tz).rotateSelf(30, 0, 0).rotateSelf(0, 30, 0).scaleSelf(sx, sy, sz);
    const model = gl.getUniformLocation(program, 'model');
    gl.uniformMatrix4fv(model, false, modelMatrix.toFloat32Array());

    // Set the cube's mvp matrix (camera x model)
    const mvpMatrix = new DOMMatrix(modelMatrix as any).preMultiplySelf(cameraMatrix);
    const mvp = gl.getUniformLocation(program, 'mvp');
    gl.uniformMatrix4fv(mvp, false, mvpMatrix.toFloat32Array());

    // Set the inverse transpose of the model matrix
    const inverseTransposeMatrix = transpose(new DOMMatrix(modelMatrix as any).invertSelf());
    const inverseTranspose = gl.getUniformLocation(program, 'inverseTranspose');
    gl.uniformMatrix4fv(inverseTranspose, false, inverseTransposeMatrix.toFloat32Array());

    // Render
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  };

  // Cube 1
  renderCube(-4, 0, 0, 1, 1, 3);

  // Cube 2
  renderCube(0, 0, 0, 1, 1, 1);

  // Cube 3
  renderCube(4, 0, 0, 1, 3, 1);
}
