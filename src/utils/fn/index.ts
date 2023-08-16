const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);

  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) || '';
      gl.deleteShader(shader);
      throw Error(`ShaderInfoLog:\n${log}`);
    }

    return shader;
  }

  throw Error(`WebGLShader not available.`);
};

export const createContext = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('webgl2');

  if (!context) {
    throw Error(`WebGL2 not available.`);
  }

  return context;
};

export const createProgram = (gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) => {
  const program = gl.createProgram();

  if (program) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) || '';
      gl.deleteProgram(program);
      throw Error(`ProgramInfoLog:\n${log}`);
    }

    return program;
  }

  throw Error(`WebGLProgram not available.`);
};

export const buffer = (gl: WebGL2RenderingContext, data: BufferSource, program: WebGLProgram, attribute: string, size: number, type: number) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, attribute);
  gl.vertexAttribPointer(location, size, type, false, 0, 0);
  gl.enableVertexAttribArray(location);
};

function move(x: number, y: number, z: number) {
  // prettier-ignore
  return [
    1, 0, 0, 0, // col 1
    0, 1, 0, 0, // col 2
    0, 0, 1, 0, // col 3
    x, y, z, 1, // col 4
  ]
}

function rotateX(radian: number) {
  const sin = Math.sin(radian);
  const cos = Math.cos(radian);
  // prettier-ignore
  return [
    1,   0,   0,  0, // col 1
    0,  cos, sin, 0, // col 2
    0, -sin, cos, 0, // col 3
    0,   0,   0,  1, // col 4
  ]
}

function rotateY(radian: number) {
  const sin = Math.sin(radian);
  const cos = Math.cos(radian);
  // prettier-ignore
  return [
    cos, 0, -sin, 0, // col 1
     0,  1,   0,  0, // col 2
    sin, 0,  cos, 0, // col 3
     0,  0,   0,  1, // col 4
  ]
}

function rotateZ(radian: number) {
  const sin = Math.sin(radian);
  const cos = Math.cos(radian);
  // prettier-ignore
  return [
     cos, sin, 0, 0, // col 1
    -sin, cos, 0, 0, // col 2
      0,   0,  1, 0, // col 3
      0,   0,  0, 1, // col 4
  ]
}

function scale(x: number, y: number, z: number) {
  // prettier-ignore
  return [
    x, 0, 0, 0, // col 1
    0, y, 0, 0, // col 2
    0, 0, z, 0, // col 3
    0, 0, 0, 1, // col 4
  ]
}
