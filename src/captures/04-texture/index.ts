import vertexSource from './vertex.vs?raw';
import fragmentSource from './fragment.fs?raw';
import { buffer, createContext, createProgram } from '../../utils/fn';

export default function render() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

  const gl = createContext(canvas);

  // Link the two shaders into a program
  const program = createProgram(gl, vertexSource, fragmentSource);
  gl.useProgram(program);

  // Interleaved data buffer (X,Y: vertex coordinates, U,V: texture coordinates)
  // Texture coordinates are also sometimes called S and T
  // prettier-ignore
  const verticesTexCoords = new Float32Array([
    -0.5, 0.5, // point 1
    0.0, 1.0,  // t 1
    -0.5, -0.5, // point 2
    0.0, 0.0,  // t 2
    0.5, 0.5,  // point 3
    1.0, 1.0,  // t 2
    0.5, -0.5, // point 4
    1.0, 0.0,  // t 4
  ]);

  const n = 4; // vertices (4)
  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT; // bytes per float (4)

  // Create the buffer object
  const vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  // Use every 1st and 2nd float for position
  const position = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(position);

  // Use every 3rd and 4th float for texCoord
  const texCoord = gl.getAttribLocation(program, 'texCoord');
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(texCoord);

  // Set the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Set a 2D texture
  const texture = gl.createTexture();
  const sampler = gl.getUniformLocation(program, 'sampler');
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = 'https://xem.github.io/webgl-guide/7/sky.jpg'; // URL or path relative to the HTML file

  image.onload = function () {
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    // Enable texture 0
    gl.activeTexture(gl.TEXTURE0);

    // Set the texture's target (2D or cubemap)
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Stretch/wrap options
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    // Bind image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Pass texture 0 to the sampler
    gl.uniform1i(sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT); // Clear canvas
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the quad
  };
}
