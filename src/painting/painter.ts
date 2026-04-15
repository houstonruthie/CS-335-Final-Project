import * as THREE from "three";
import { TextureCanvas } from "./textureCanvas";
import type { BrushType } from "./brush";

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
    opacity: number = 1,
    brushType: BrushType = "soft"
  ): void {
    this.textureCanvas.paintAtUV(u, v, color, radius, opacity, brushType);
  }

  public paintStroke(
    startUV: THREE.Vector2,
    endUV: THREE.Vector2,
    color: string = "#ff0000",
    radius: number = 20,
    opacity: number = 1,
    brushType: BrushType = "soft"
  ): void {
    let dx = endUV.x - startUV.x;
    const dy = endUV.y - startUV.y;

    // Handle wraparound at UV seam
    if (Math.abs(dx) > 0.5) {
      dx = dx > 0 ? dx - 1 : dx + 1;
    }

    const distance = Math.sqrt(dx * dx + dy * dy);
    const uvStep = Math.max(0.001, radius / this.textureCanvas.getWidth() / 2);
    const steps = Math.max(1, Math.ceil(distance / uvStep));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      let u = startUV.x + dx * t;
      const v = startUV.y + dy * t;

      // Wrap back into 0..1 range
      if (u < 0) {
        u += 1;
      } else if (u > 1) {
        u -= 1;
      }

      this.paint(u, v, color, radius, opacity, brushType);
    }
  }

  public smudgeStroke(
    startUV: THREE.Vector2,
    endUV: THREE.Vector2,
    radius: number = 20,
    strength: number = 0.6
  ): void {
    let dx = endUV.x - startUV.x;
    const dy = endUV.y - startUV.y;

    // Handle wraparound at UV seam
    if (Math.abs(dx) > 0.5) {
      dx = dx > 0 ? dx - 1 : dx + 1;
    }

    const distance = Math.sqrt(dx * dx + dy * dy);
    const uvStep = Math.max(0.001, radius / this.textureCanvas.getWidth() / 2);
    const steps = Math.max(1, Math.ceil(distance / uvStep));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      let u = startUV.x + dx * t;
      const v = startUV.y + dy * t;

      if (u < 0) {
        u += 1;
      } else if (u > 1) {
        u -= 1;
      }

      this.textureCanvas.smudgeAtUV(u, v, dx, dy, radius, strength);
    }
  }

  public clear(): void {
    this.textureCanvas.clear();
  }

  public getTextureCanvas(): TextureCanvas {
    return this.textureCanvas;
  }
}