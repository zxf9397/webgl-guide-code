import { GAttribute, IGLAttribute } from './attribute';
import type { GL2CreateProgramOptions, GL2Canvas } from './canvas';
import { GUniform, IGLUniform } from './uniform';

export class GLProgram<A extends string, U extends string> {
  public readonly program: WebGLProgram;
  public readonly attributes: Record<A, GAttribute>;
  public readonly uniforms: Record<U, GUniform>;

  constructor(private readonly canvas: GL2Canvas, options: GL2CreateProgramOptions<A, U>) {
    const vertexShader = this._createShader(canvas.context.VERTEX_SHADER, options.vertexShaderSource);
    const fragmentShader = this._createShader(canvas.context.FRAGMENT_SHADER, options.fragmentShaderSource);

    this.program = this._createProgram(vertexShader, fragmentShader);

    this.attributes = this._createAttributes(options.attributes);
    this.uniforms = this._createUniforms(options.uniforms);
  }

  public useProgram = () => {
    const { context } = this.canvas;
    context.useProgram(this.program);
  };

  private _createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const { context } = this.canvas;
    const program = context.createProgram();
    if (!program) {
      throw Error(`WebGLProgram not available.`);
    }

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      const log = context.getProgramInfoLog(program);
      context.deleteProgram(program);
      throw Error(`Could not link webcontext program.\n${log}`);
    }

    return program;
  }

  private _createShader(type: number, source: string) {
    const { context } = this.canvas;
    const shader = context.createShader(type);
    if (!shader) {
      throw Error(`WebGLShader not available.`);
    }

    context.shaderSource(shader, source);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      const log = context.getShaderInfoLog(shader);
      context.deleteShader(shader);
      throw Error(`Could not compile shader.\n${log}`);
    }

    return shader;
  }

  private _createAttributes(attributes?: Record<A, IGLAttribute>) {
    return Object.fromEntries(
      Object.entries<IGLAttribute>(attributes || {}).map(([name, attribute]) => [name, new GAttribute(this.canvas.context, this.program, attribute)])
    ) as Record<A, GAttribute>;
  }

  private _createUniforms(uniforms?: Record<U, IGLUniform>) {
    return Object.fromEntries(
      Object.entries<IGLUniform>(uniforms || {}).map(([name, uniform]) => [name, new GUniform(this.canvas, this.program, uniform)])
    ) as Record<U, GUniform>;
  }
}
