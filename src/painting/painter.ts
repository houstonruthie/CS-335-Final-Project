import * as THREE from "three";
import { TextureCanvas } from "./textureCanvas";
import type { BrushType } from "./brush";
import { getStrokeSteps, lerpUV } from "../interaction/uv";

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
    const steps = getStrokeSteps(
      startUV,
      endUV,
      radius,
      this.textureCanvas.getWidth()
    );

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const uv = lerpUV(startUV, endUV, t);
      this.paint(uv.x, uv.y, color, radius, opacity, brushType);
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
    const steps = getStrokeSteps(
      startUV,
      endUV,
      radius,
      this.textureCanvas.getWidth()
    );

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const uv = lerpUV(startUV, endUV, t);
      this.textureCanvas.smudgeAtUV(uv.x, uv.y, dx, dy, radius, strength);
    }
  }

  public clear(): void {
    this.textureCanvas.clear();
  }

  public getTextureCanvas(): TextureCanvas {
    return this.textureCanvas;
  }
}