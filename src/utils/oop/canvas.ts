import type { KeyofType } from './data.d';
import type { IGLAttribute } from './attribute';
import type { IGLUniform } from './uniform';

import { GLProgram } from './program';
import { GTexture, TextureIndex } from './texture';

type GL2ProgramPropsType<T extends GLProgram<string, string>> = T extends GLProgram<infer A, infer U> ? { A: A; U: U } : never;

export interface GL2CanvasOptions {
  width: number;
  height: number;
  options?: WebGLContextAttributes;
}

export interface GL2CreateProgramOptions<A extends string, U extends string> {
  vertexShaderSource: string;
  fragmentShaderSource: string;
  attributes?: Record<A, IGLAttribute>;
  uniforms?: Record<U, IGLUniform>;
}

export class GL2Canvas {
  public readonly canvas: HTMLCanvasElement;
  public readonly context: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement, width?: number, height?: number);
  constructor(selector: string, width?: number, height?: number);
  constructor(canvas: HTMLCanvasElement | string, width?: number, height?: number) {
    const _canvas = typeof canvas === 'string' ? (document.querySelector(canvas) as HTMLCanvasElement) : canvas;

    if (!(_canvas instanceof HTMLCanvasElement)) {
      throw Error(`Not HTMLCanvasElement.`);
    }

    this.canvas = _canvas;
    this.canvas.width = width || this.canvas.width;
    this.canvas.height = height || this.canvas.height;

    const context = this.canvas.getContext('webgl2');
    if (!context) {
      throw Error(`WebGL2.0 not available.`);
    }
    this.context = context;
  }

  public createProgram<T extends GL2CreateProgramOptions<string, string>>(
    options: T
  ): GLProgram<KeyofType<T['attributes']>, KeyofType<T['uniforms']>>;
  public createProgram<A extends string, U extends string>(options: Required<GL2CreateProgramOptions<A, U>>): GLProgram<A, U>;
  public createProgram<T extends GLProgram<string, string>>(
    options: GL2CreateProgramOptions<GL2ProgramPropsType<T>['A'], GL2ProgramPropsType<T>['U']>
  ): T;
  public createProgram<T extends GL2CreateProgramOptions<string, string>>(options: T) {
    return new GLProgram<KeyofType<T['attributes']>, KeyofType<T['uniforms']>>(this, options);
  }

  public createTexture(index: TextureIndex) {
    return new GTexture(this, index);
  }
}
