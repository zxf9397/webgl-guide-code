// Create a perspective matrix
// options: fov in degrees, aspect, near, far
// return: DOMMatrix
export const perspective = (options: { fov: number; aspect: number; near: number; far: number }) => {
  let fov = options.fov || 85;
  fov = (fov * Math.PI) / 180; // fov in radians
  const aspect = options.aspect || 1; // canvas.width / canvas.height
  const near = options.near || 0.01; // can't be 0
  const far = options.far || 100;
  const f = 1 / Math.tan(fov);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new DOMMatrix([
    f / aspect, 0, 0,                   0,
    0,          f, 0,                   0,
    0,          0, (far + near) * nf,  -1,
    0,          0, 2 * near * far * nf, 0
  ]);
};

// LookAt generates a matrix corresponding to a camera placed at a given point and looking at a target point.
// options: camera position (cameraX, cameraY, cameraZ), target (targetX, targetY, targetZ), up vector (upX, upY, upZ, optional, verticl by default)
// return: DOMMatrix.
export const lookAt = (
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  targetX: number,
  targetY: number,
  targetZ: number,
  upX = 0,
  upY = 1,
  upZ = 0
) => {
  let e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
  fx = targetX - cameraX;
  fy = targetY - cameraY;
  fz = targetZ - cameraZ;
  rlf = 1 / Math.hypot(fx, fy, fz);
  fx *= rlf;
  fy *= rlf;
  fz *= rlf;
  sx = fy * upZ - fz * upY;
  sy = fz * upX - fx * upZ;
  sz = fx * upY - fy * upX;
  rls = 1 / Math.hypot(sx, sy, sz);
  sx *= rls;
  sy *= rls;
  sz *= rls;
  ux = sy * fz - sz * fy;
  uy = sz * fx - sx * fz;
  uz = sx * fy - sy * fx;
  const ret = new DOMMatrix([sx, ux, -fx, 0, sy, uy, -fy, 0, sz, uz, -fz, 0, 0, 0, 0, 1]);
  return ret.translateSelf(-cameraX, -cameraY, -cameraZ);
};

// Create an orthogonal matrix
// options: top, bottom, left, right, near, far
// return: DOMMatrix
export const orthogonal = (options: { top: number; bottom: number; left: number; right: number; near: number; far: number }) => {
  const top = options.top;
  const bottom = options.bottom;
  const left = options.left;
  const right = options.right;
  const near = options.near || 0;
  const far = options.far || 100;
  const rw = 1 / (right - left);
  const rh = 1 / (top - bottom);
  const rd = 1 / (far - near);
  return new DOMMatrix([2 * rw, 0, 0, 0, 0, 2 * rh, 0, 0, 0, 0, -2 * rd, 0, -(right + left) * rw, -(top + bottom) * rh, -(far + near) * rd, 1]);
};
