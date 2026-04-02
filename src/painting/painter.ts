import * as THREE from "three";
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

  public paintStroke(
    startUV: THREE.Vector2,
    endUV: THREE.Vector2,
    color: string = "#ff0000",
    radius: number = 20,
    opacity: number = 1
  ): void {
    const dx = endUV.x - startUV.x;
    const dy = endUV.y - startUV.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const stepSize = 0.005;
    const steps = Math.max(1, Math.ceil(distance / stepSize));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const u = startUV.x + dx * t;
      const v = startUV.y + dy * t;

      this.paint(u, v, color, radius, opacity);
    }
  }

  public clear(): void {
    this.textureCanvas.clear();
  }

  public getTextureCanvas(): TextureCanvas {
    return this.textureCanvas;
  }
}
