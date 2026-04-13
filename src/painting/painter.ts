import * as THREE from "three";
import { TextureCanvas } from "./textureCanvas";

export type BrushType = "soft" | "hardbrush" | "spray";

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
    const dx = endUV.x - startUV.x;
    const dy = endUV.y - startUV.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const uvStep = Math.max(0.001, radius / 1024 / 2);
    const steps = Math.max(1, Math.ceil(distance / uvStep));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const u = startUV.x + dx * t;
      const v = startUV.y + dy * t;
      this.paint(u, v, color, radius, opacity, brushType);
    }
  }

  public smudgeStroke(
    startUV: THREE.Vector2,
    endUV: THREE.Vector2,
    radius: number = 20,
    strength: number = 0.6
  ): void {
    const dx = endUV.x - startUV.x;
    const dy = endUV.y - startUV.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const uvStep = Math.max(0.001, radius / 1024 / 2);
    const steps = Math.max(1, Math.ceil(distance / uvStep));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const u = startUV.x + dx * t;
      const v = startUV.y + dy * t;
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
