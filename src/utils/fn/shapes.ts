// Declare a plane (2x2)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)]
//
//  v1------v0
//  |       |
//  |   x   |
//  |       |
//  v2------v3

import { transpose } from './matrix';

type Vertices = Float32Array;
type Normals = Float32Array;
type Indices = Uint16Array;
type Shape = [Vertices, Normals, Indices];

export const plane = () => {
  // prettier-ignore
  const vertices = new Float32Array([
     1.0,  1.0, 0.0,
    -1.0,  1.0, 0.0,
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0
  ]);

  // prettier-ignore
  const normals = new Float32Array([
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0
  ]);

  // prettier-ignore
  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3
  ]);

  return [vertices, normals, indices] as Shape;
};

// Declare a cube (2x2x2)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)]
//
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |   x | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3

export const cube = () => {
  // prettier-ignore
  const vertices = new Float32Array([
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,  1.0,-1.0, 1.0, // front
    1.0, 1.0, 1.0,  1.0,-1.0, 1.0,   1.0,-1.0,-1.0,  1.0, 1.0,-1.0, // right
    1.0, 1.0, 1.0,  1.0, 1.0,-1.0,  -1.0, 1.0,-1.0, -1.0, 1.0, 1.0, // up
   -1.0, 1.0, 1.0, -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0, -1.0,-1.0, 1.0, // left
   -1.0,-1.0,-1.0,  1.0,-1.0,-1.0,   1.0,-1.0, 1.0, -1.0,-1.0, 1.0, // down
    1.0,-1.0,-1.0, -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,  1.0, 1.0,-1.0  // back
  ]);

  // prettier-ignore
  const normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,   0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // back
  ]);

  // prettier-ignore
  const indices = new Uint16Array([
    0,  1,  2,   0,  2,  3,  // front
    4,  5,  6,   4,  6,  7,  // right
    8,  9,  10,  8,  10, 11, // up
    12, 13, 14,  12, 14, 15, // left
    16, 17, 18,  16, 18, 19, // down
    20, 21, 22,  20, 22, 23  // back
  ]);

  return [vertices, normals, indices] as Shape;
};

// Declare a sphere (customizable precision, radius = 1)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)]
export function sphere(precision = 25) {
  const positions = [];
  const normals = [];
  const indices = [];

  // Coordinates
  for (let par = 0; par <= precision; par++) {
    const lat = Math.PI * (par / precision);
    const latX = Math.sin(lat);
    const latY = Math.cos(lat);

    for (let mer = 0; mer <= precision; mer++) {
      const lon = 2 * Math.PI * (mer / precision);
      const lonX = Math.cos(lon) * latX; // cos = lonX / latX
      const lonZ = Math.sin(lon) * latX; // sin = lonZ / latX

      positions.push(lonX, latY, lonZ);
      normals.push(lonX, latY, lonZ);
    }
  }

  // Indices
  for (let par = 0; par < precision; par++) {
    for (let mer = 0; mer < precision; mer++) {
      const p1 = par * (precision + 1) + mer;
      const p2 = p1 + (precision + 1);
      const p3 = p1 + 1;
      const p4 = p2 + 1;

      indices.push(p1);
      indices.push(p2);
      indices.push(p3);

      indices.push(p3);
      indices.push(p2);
      indices.push(p4);
    }
  }

  return [new Float32Array(positions), new Float32Array(normals), new Uint16Array(indices)] as [
    Float32Array,
    Float32Array,
    Uint16Array
  ];
}

// Declare a pyramid (base: 1x1 square, sides: equilateral triangles)
// Returns [vertices (Float32Array), normals (Float32Array), indices (Uint16Array)]
export const pyramid = () => {
  // prettier-ignore
  const vertices = new Float32Array([
    -0.5, 0.0, 0.5,     0.5, 0.0, 0.5,   0.0, 0.866, 0.0,  // Front
     0.5, 0.0, 0.5,     0.5, 0.0, -0.5,  0.0, 0.866, 0.0,  // Right
     0.5, 0.0, -0.5,   -0.5, 0.0, -0.5,  0.0, 0.866, 0.0,  // Back
    -0.5, 0.0, -0.5,   -0.5, 0.0, 0.5,   0.0, 0.866, 0.0,  // Left
    -0.5, 0.0, 0.5,    -0.5, 0.0, -0.5,   0.5, 0.0, 0.5,   // Base 1 
    -0.5, 0.0, -0.5,    0.5, 0.0, -0.5,   0.5, 0.0, 0.5    // Base 2 
  ]);

  // prettier-ignore
  const normals = new Float32Array([
     0,     -0.5,  0.866,   0,     -0.5,  0.866,  0,     -0.5,  0.866,  // Back
     0.866, -0.5,  0,       0.866, -0.5,  0,      0.866, -0.5,  0,  // Left
     0,     -0.5, -0.866,   0,     -0.5, -0.866,  0,     -0.5, -0.866, // Front
    -0.866, -0.5,  0,      -0.866, -0.5,  0,     -0.866, -0.5,  0,  // Right
     0,      1,    0,       0,      1,    0,      0,      1,    0,         // Base
     0,      1,    0,       0,      1,    0,      0,      1,    0
  ]);

  // prettier-ignore
  const indices = new Uint16Array([
    0, 1, 2,    // Front
    3, 4, 5,    // Right
    6, 7, 8,    // Back
    9, 10, 11,  // Left
    12, 13, 14,  15, 16, 17 // Base
  ]);

  return [vertices, normals, indices];
};

// Draw a model
export const drawModel = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  cameraMatrix: DOMMatrix,
  modelMatrix: number[],
  n: number
) => {
  // Set the model matrix (add the custom scale if any)
  const model = gl.getUniformLocation(program, 'model');
  gl.uniformMatrix4fv(model, false, new DOMMatrix(modelMatrix).toFloat32Array());

  // Set the cube's mvp matrix (camera x model)
  const mvpMatrix = new DOMMatrix(modelMatrix).preMultiplySelf(cameraMatrix);
  const mvp = gl.getUniformLocation(program, 'mvp');
  gl.uniformMatrix4fv(mvp, false, mvpMatrix.toFloat32Array());

  // Set the inverse transpose of the model matrix
  const inverseTransposeMatrix = transpose(new DOMMatrix(modelMatrix).invertSelf());
  const inverseTranspose = gl.getUniformLocation(program, 'inverseTranspose');
  gl.uniformMatrix4fv(inverseTranspose, false, inverseTransposeMatrix.toFloat32Array());

  // Render
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
};
