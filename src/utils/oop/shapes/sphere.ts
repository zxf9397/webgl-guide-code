interface SphereOptions {
  precision?: number;
  color: [number, number, number];
}

export class Sphere {
  public readonly vertices: Float32Array;
  public readonly normals: Float32Array;
  public readonly indices: Uint16Array;

  constructor(options?: SphereOptions) {
    let i, ai, si, ci;
    let j, aj, sj, cj;
    let p1, p2;
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    const defaultOptions: Required<SphereOptions> = { precision: 25, color: [1, 1, 1] };
    const { precision, color } = Object.assign(defaultOptions, options);

    // Coordinates
    for (j = 0; j <= precision; j++) {
      aj = (j * Math.PI) / precision;
      sj = Math.sin(aj);
      cj = Math.cos(aj);
      for (i = 0; i <= precision; i++) {
        ai = (i * 2 * Math.PI) / precision;
        si = Math.sin(ai);
        ci = Math.cos(ai);

        positions.push(si * sj); // X
        positions.push(cj); // Y
        positions.push(ci * sj); // Z

        normals.push(...color);
      }
    }

    // Indices
    for (j = 0; j < precision; j++) {
      for (i = 0; i < precision; i++) {
        p1 = j * (precision + 1) + i;
        p2 = p1 + (precision + 1);

        indices.push(p1);
        indices.push(p2);
        indices.push(p1 + 1);

        indices.push(p1 + 1);
        indices.push(p2);
        indices.push(p2 + 1);
      }
    }

    this.vertices = new Float32Array(positions);
    this.normals = new Float32Array(normals);
    this.indices = new Uint16Array(indices);
  }
}
