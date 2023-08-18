interface CubeOptions {
  color?: [number, number, number];
}

export class Cube {
  public readonly vertices: Float32Array;
  public readonly normals: Float32Array;
  public readonly indices: Uint16Array;

  constructor(options?: CubeOptions) {
    // prettier-ignore
    this.vertices = new Float32Array([
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,  1.0,-1.0, 1.0, // front
      1.0, 1.0, 1.0,  1.0,-1.0, 1.0,   1.0,-1.0,-1.0,  1.0, 1.0,-1.0, // right
      1.0, 1.0, 1.0,  1.0, 1.0,-1.0,  -1.0, 1.0,-1.0, -1.0, 1.0, 1.0, // up
     -1.0, 1.0, 1.0, -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0, -1.0,-1.0, 1.0, // left
     -1.0,-1.0,-1.0,  1.0,-1.0,-1.0,   1.0,-1.0, 1.0, -1.0,-1.0, 1.0, // down
      1.0,-1.0,-1.0, -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,  1.0, 1.0,-1.0  // back
    ]);

    const [r, g, b] = options?.color || [1.0, 1.0, 1.0];
    // prettier-ignore
    this.normals = new Float32Array([
      r, g, b, r, g, b,  r, g, b, r, g, b, // front
      r, g, b, r, g, b,  r, g, b, r, g, b, // right
      r, g, b, r, g, b,  r, g, b, r, g, b, // up
      r, g, b, r, g, b,  r, g, b, r, g, b, // left
      r, g, b, r, g, b,  r, g, b, r, g, b, // down
      r, g, b, r, g, b,  r, g, b, r, g, b  // back
    ]);

    // prettier-ignore
    this.indices = new Uint16Array([
      0,  1,  2,   0,  2,  3,  // front
      4,  5,  6,   4,  6,  7,  // right
      8,  9,  10,  8,  10, 11, // up
      12, 13, 14,  12, 14, 15, // left
      16, 17, 18,  16, 18, 19, // down
      20, 21, 22,  20, 22, 23  // back
    ]);
  }
}
