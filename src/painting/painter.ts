import { TextureCanvas } from "./textureCanvas";

export class Painter {
  private textureCanvas: TextureCanvas;

  constructor(textureCanvas: TextureCanvas) {
    this.textureCanvas = textureCanvas;
  }

  public paint(
    u: number,
    v: number,
    color: string = "#ff0000",
    radius: number = 20,
    opacity: number = 1
  ): void {
    this.textureCanvas.paintAtUV(u, v, color, radius, opacity);
  }

  public clear(): void {
    this.textureCanvas.clear();
  }

  public getTextureCanvas(): TextureCanvas {
    return this.textureCanvas;
  }
}