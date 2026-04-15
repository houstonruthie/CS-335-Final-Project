import { ShapeManager } from "../scene/shapeManager";

type ShapeSnapshot = ImageData[];

export class HistoryManager {
  private undoStacks = new Map<string, ShapeSnapshot[]>();
  private redoStacks = new Map<string, ShapeSnapshot[]>();
  private shapeManager: ShapeManager;

  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  private getActiveShape() {
    return this.shapeManager.getActiveShape();
  }

  private ensureStacks(shapeKey: string): void {
    if (!this.undoStacks.has(shapeKey)) {
      this.undoStacks.set(shapeKey, []);
    }

    if (!this.redoStacks.has(shapeKey)) {
      this.redoStacks.set(shapeKey, []);
    }
  }

  private captureActiveShapeSnapshot(): ShapeSnapshot | null {
    const activeShape = this.getActiveShape();
    if (!activeShape) {
      return null;
    }

    return activeShape.textureCanvases.map((textureCanvas) =>
      textureCanvas.getImageData()
    );
  }

  private applySnapshot(snapshot: ShapeSnapshot): void {
    const activeShape = this.getActiveShape();
    if (!activeShape) {
      return;
    }

    activeShape.textureCanvases.forEach((textureCanvas, index) => {
      const imageData = snapshot[index];
      if (!imageData) {
        return;
      }

      textureCanvas.setImageData(imageData);
    });

    activeShape.materials.forEach((material) => {
      if (material.map) {
        material.map.needsUpdate = true;
      }
    });
  }

  public saveSnapshot(): void {
    const activeShape = this.getActiveShape();
    if (!activeShape) {
      return;
    }

    this.ensureStacks(activeShape.key);

    const snapshot = this.captureActiveShapeSnapshot();
    if (!snapshot) {
      return;
    }

    this.undoStacks.get(activeShape.key)!.push(snapshot);
    this.redoStacks.set(activeShape.key, []);
  }

  public undo(): void {
    const activeShape = this.getActiveShape();
    if (!activeShape) {
      return;
    }

    this.ensureStacks(activeShape.key);

    const undoStack = this.undoStacks.get(activeShape.key)!;
    const redoStack = this.redoStacks.get(activeShape.key)!;

    if (undoStack.length === 0) {
      return;
    }

    const currentSnapshot = this.captureActiveShapeSnapshot();
    if (currentSnapshot) {
      redoStack.push(currentSnapshot);
    }

    const previousSnapshot = undoStack.pop()!;
    this.applySnapshot(previousSnapshot);
  }

  public redo(): void {
    const activeShape = this.getActiveShape();
    if (!activeShape) {
      return;
    }

    this.ensureStacks(activeShape.key);

    const undoStack = this.undoStacks.get(activeShape.key)!;
    const redoStack = this.redoStacks.get(activeShape.key)!;

    if (redoStack.length === 0) {
      return;
    }

    const currentSnapshot = this.captureActiveShapeSnapshot();
    if (currentSnapshot) {
      undoStack.push(currentSnapshot);
    }

    const nextSnapshot = redoStack.pop()!;
    this.applySnapshot(nextSnapshot);
  }

  public clearHistoryForActiveShape(): void {
    const activeShape = this.getActiveShape();
    if (!activeShape) {
      return;
    }

    this.undoStacks.set(activeShape.key, []);
    this.redoStacks.set(activeShape.key, []);
  }
}