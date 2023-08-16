import { OmitFirstIndexType } from './data';

export interface PointerAttribute {
  size?: number;
  type?: number;
  normalize?: boolean;
  stride?: number;
  offset?: number;
}

export interface IGLAttribute extends PointerAttribute {
  /** variable name in vertex shader */
  name: string;
}

type VertexAttribType<T extends keyof WebGL2RenderingContextBase> = T extends `vertexAttrib${infer U}`
  ? U extends `${any}f${any}`
    ? U
    : never
  : never;

type VertexAttribFn = VertexAttribType<keyof WebGL2RenderingContextBase>;

class GLAttribute {
  public readonly location: number;
  public readonly buffer: WebGLBuffer;
  private readonly attribute: Required<IGLAttribute>;

  constructor(private readonly context: WebGL2RenderingContext, program: WebGLProgram, attribute: IGLAttribute) {
    this.location = this._getAttribLocation(program, attribute.name);
    this.buffer = this._createBuffer();
    this.attribute = Object.assign(
      {
        size: 2,
        type: context.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0,
      } as Required<PointerAttribute>,
      attribute
    );
  }

  private _getAttribLocation(program: WebGLProgram, attributeName: string) {
    const location = this.context.getAttribLocation(program, attributeName);
    if (location < 0) {
      throw Error(`Webcontext getAttribLocation returned -1.\n'${attributeName}' is not defined in shader.`);
    }

    return location;
  }

  private _createBuffer() {
    const { context } = this;

    const buffer = context.createBuffer();
    if (!buffer) {
      throw Error(`Webcontext createBuffer returned null.`);
    }

    return buffer;
  }

  public bindData(data: number[]) {
    const { context, buffer } = this;

    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(data), context.STATIC_DRAW);
  }

  public vertexAttribPointer(attribute?: PointerAttribute) {
    const { context, location, buffer } = this;

    context.enableVertexAttribArray(location);

    context.bindBuffer(context.ARRAY_BUFFER, buffer);

    const { size, type, normalize, stride, offset } = Object.assign(this.attribute, attribute);

    context.vertexAttribPointer(location, size, type, normalize, stride, offset);
  }

  public vertexAttrib<K extends VertexAttribFn>(type: K, ...args: OmitFirstIndexType<Parameters<WebGLRenderingContextBase[`vertexAttrib${K}`]>>) {
    const { context, location } = this;
    (context[`vertexAttrib${type}`] as any)(location, ...args);
  }
}

export { GLAttribute as GAttribute };
