import * as THREE from "three";
import type { PaintableShape } from "./shapeTypes";

export class ShapeManager {
  private shapes = new Map<string, PaintableShape>();
  private activeShapeKey: string | null = null;

  constructor(scene: THREE.Scene, shapes: PaintableShape[]) {
    for (const shape of shapes) {
      this.shapes.set(shape.key, shape);
      shape.setVisible(false);
      scene.add(shape.mesh);
    }

    if (shapes.length > 0) {
      this.activeShapeKey = shapes[0].key;
      this.getActiveShape()?.setVisible(true);
    }
  }

  public getShapeKeys(): string[] {
    return [...this.shapes.keys()];
  }

  public getShape(key: string): PaintableShape | null {
    return this.shapes.get(key) ?? null;
  }

  public getActiveShape(): PaintableShape | null {
    if (!this.activeShapeKey) return null;
    return this.getShape(this.activeShapeKey);
  }

  public setActiveShape(key: string): void {
    if (this.activeShapeKey === key) return;

    const current = this.getActiveShape();
    current?.setVisible(false);

    this.activeShapeKey = key;

    const next = this.getActiveShape();
    next?.setVisible(true);
  }
}