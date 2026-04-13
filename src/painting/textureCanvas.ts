export type BrushType = "soft" | "hardbrush" | "spray";

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

    const context = this.canvas.getContext("2d", { willReadFrequently: true });
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
    opacity: number = 1,
    brushType: BrushType = "soft"
  ): void {
    const x = u * this.width;
    const y = (1 - v) * this.height;

    if (brushType === "soft") {
      this.paintSoftBrush(x, y, color, radius, opacity);
    } else if (brushType === "hardbrush") {
      this.painthardbrushBrush(x, y, color, radius, opacity);
    } else if (brushType === "spray") {
      this.paintSprayBrush(x, y, color, radius, opacity);
    }
  }

  private paintSoftBrush(
    x: number,
    y: number,
    color: string,
    radius: number,
    opacity: number
  ): void {
    const transparentColor = this.hexToRgba(color, 0);
    const solidColor = this.hexToRgba(color, 1);

    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, solidColor);
    gradient.addColorStop(1, transparentColor);

    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  private painthardbrushBrush(
    x: number,
    y: number,
    color: string,
    radius: number,
    opacity: number
  ): void {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, Math.max(1, radius * 0.35), 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  private paintSprayBrush(
    x: number,
    y: number,
    color: string,
    radius: number,
    opacity: number
  ): void {
    this.ctx.save();
    this.ctx.fillStyle = color;

    const dots = Math.max(20, radius * 3);

    for (let i = 0; i < dots; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const px = x + Math.cos(angle) * distance;
      const py = y + Math.sin(angle) * distance;

      this.ctx.globalAlpha = opacity * (0.2 + Math.random() * 0.5);
      this.ctx.beginPath();
      this.ctx.arc(px, py, Math.max(1, radius * 0.08), 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  public smudgeAtUV(
    u: number,
    v: number,
    deltaU: number,
    deltaV: number,
    radius: number = 20,
    strength: number = 0.6
  ): void {
    const x = Math.floor(u * this.width);
    const y = Math.floor((1 - v) * this.height);

    const offsetX = Math.round(deltaU * this.width * strength);
    const offsetY = Math.round(-deltaV * this.height * strength);

    const size = Math.max(4, Math.floor(radius * 2));
    const half = Math.floor(size / 2);

    const srcX = this.clamp(x - half, 0, this.width - size);
    const srcY = this.clamp(y - half, 0, this.height - size);

    const imageData = this.ctx.getImageData(srcX, srcY, size, size);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;

    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) {
      return;
    }

    tempCtx.putImageData(imageData, 0, 0);

    const destX = this.clamp(srcX + offsetX, 0, this.width - size);
    const destY = this.clamp(srcY + offsetY, 0, this.height - size);

    this.ctx.save();
    this.ctx.globalAlpha = 0.35;
    this.ctx.drawImage(tempCanvas, destX, destY);
    this.ctx.restore();
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private hexToRgba(hex: string, alpha: number): string {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
}
