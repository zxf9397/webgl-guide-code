import { GL2Canvas } from './canvas';
import { OmitFirstIndexType } from './data';

export interface IGLUniform {
  name: string;
}

type UniformType<T extends string> = T extends `uniform${infer U}` ? U : never;
type UniformMatrixType<T extends string> = T extends `uniform${infer U}` ? (U extends `Matrix${any}` ? U : never) : never;

type UniformFn = UniformType<keyof WebGLRenderingContextBase>;
type UniformMatrixFn = UniformMatrixType<keyof WebGLRenderingContextOverloads>;
type UniformArrayFn = Exclude<UniformType<keyof WebGLRenderingContextOverloads>, UniformMatrixFn>;

class GUniform {
  public location: WebGLUniformLocation;
  public buffer: WebGLBuffer;

  constructor(private gCanvas: GL2Canvas, private program: WebGLProgram, uniform: IGLUniform) {
    const { context } = gCanvas;

    const location = context.getUniformLocation(program, uniform.name);
    if (!location) {
      throw Error(`Variable '${uniform.name}' does not exist in shader.`);
    }

    const buffer = context.createBuffer();
    if (!buffer) {
      throw Error(`Webcontext createBuffer returned null.`);
    }

    this.location = location;
    this.buffer = buffer;
  }

  public uniform<K extends UniformFn>(type: K, ...args: OmitFirstIndexType<Parameters<WebGLRenderingContextBase[`uniform${K}`]>>) {
    const { gCanvas, location } = this;
    (gCanvas.context[`uniform${type}`] as any)(location, ...args);
  }

  public uniformArray<K extends UniformArrayFn>(type: K, ...args: OmitFirstIndexType<Parameters<WebGLRenderingContextOverloads[`uniform${K}`]>>) {
    const { gCanvas, location } = this;
    (gCanvas.context[`uniform${type}`] as any)(location, ...args);
  }

  public uniformMatrix<K extends UniformMatrixFn>(type: K, ...args: OmitFirstIndexType<Parameters<WebGLRenderingContextOverloads[`uniform${K}`]>>) {
    const { gCanvas, location } = this;
    (gCanvas.context[`uniform${type}`] as any)(location, ...args);
  }
}

export { GUniform };
