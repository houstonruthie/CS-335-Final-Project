export class TextureCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(width = 1024, height = 1024) {
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not create 2D canvas context.");
    }

    this.ctx = context;
    this.clear();
  }

  public clear(color: string = "#ffffff"): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public paintAtUV(
    u: number,
    v: number,
    color: string = "#ff0000",
    radius: number = 20,
    opacity: number = 1
  ): void {
    const x = u * this.width;
    const y = (1 - v) * this.height;

    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
    }

    public getImageData(): ImageData {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    }

    public setImageData(imageData: ImageData): void {
        this.ctx.putImageData(imageData, 0, 0);
    }
}