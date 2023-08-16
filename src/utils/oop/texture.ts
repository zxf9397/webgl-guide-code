import type { GL2Canvas } from './canvas';
import type { GUniform } from './uniform';

export interface TextureOptions {
  image: TexImageSource;
}

type TextureIndexType<T extends string> = T extends `TEXTURE${infer N}` ? (N extends `_${infer S}` ? never : N) : never;

export type TextureIndex = TextureIndexType<keyof WebGLRenderingContextBase>;

class GTexture {
  public texture: WebGLTexture;
  private index: TextureIndex;
  private created = false;

  constructor(private gCanvas: GL2Canvas, index: TextureIndex) {
    const texture = gCanvas.context.createTexture();

    if (!texture) {
      throw Error(`Webcontext createTexture returned null.`);
    }

    this.texture = texture;
    this.index = index;
  }

  public bindImage(source: TexImageSource): void;
  public bindImage(source: ArrayBufferView, xoffset: number, yoffset: number, width: number, height: number): void;
  public bindImage(source: ArrayBufferView, width: number, height: number): void;
  public bindImage(source: TexImageSource | ArrayBufferView, ...args: number[]) {
    const {
      gCanvas: { context },
      texture,
      index,
    } = this;
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1);

    context.activeTexture(context[`TEXTURE${index}`]);

    context.bindTexture(context.TEXTURE_2D, texture);

    /*  if (this.created) {
      if (args.length === 4) {
        context.texSubImage2D()
        context.texSubImage2D(
          context.TEXTURE_2D,
          0,
          args[0],
          args[1],
          args[2],
          args[3],
          context.RGBA,
          context.UNSIGNED_BYTE,
          source as ArrayBufferView,
        );
      } else {
        context.texSubImage2D(context.TEXTURE_2D, 0, 0, 0, context.RGBA, context.UNSIGNED_BYTE, source as TexImageSource);
      }
    } else {
      this.created = true;
      if (args.length === 2) {
        context.texImage2D(
          context.TEXTURE_2D,
          0,
          context.RGBA,
          args[0],
          args[1],
          0,
          context.RGBA,
          context.UNSIGNED_BYTE,
          source as ArrayBufferView,
        );
      } else {
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, source as TexImageSource);
      }
    }
 */
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);

    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 0);
  }

  public bindWidthUniform(uniform: GUniform) {
    const { gCanvas, index } = this;
    gCanvas.context.uniform1i(uniform.location, Number(index));
  }
}

export { GTexture };
