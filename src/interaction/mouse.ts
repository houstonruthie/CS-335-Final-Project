import * as THREE from "three";
import { SceneRaycaster } from "./raycaster";
import { ShapeManager } from "../scene/shapeManager";
import type { UIState } from "../ui/controls";

type MouseControllerDeps = {
  canvas: HTMLCanvasElement;
  camera: THREE.Camera;
  raycaster: SceneRaycaster;
  shapeManager: ShapeManager;
  uiState: UIState;
  updateBrushPreview: (event: MouseEvent) => void;
};

export function setupMousePainting({
  canvas,
  camera,
  raycaster,
  shapeManager,
  uiState,
  updateBrushPreview
}: MouseControllerDeps): void {
  let isPainting = false;
  let isRotating = false;

  let lastPaintUV: THREE.Vector2 | null = null;
  let currentFaceIndex: number | undefined = undefined;

  let lastMouseX = 0;
  let lastMouseY = 0;

  function getActiveShape() {
    return shapeManager.getActiveShape();
  }

  function getActiveMesh(): THREE.Object3D | null {
    const activeShape = getActiveShape();
    return activeShape ? activeShape.mesh : null;
  }

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  canvas.addEventListener("mousedown", (event: MouseEvent) => {
    const activeShape = getActiveShape();
    const activeMesh = getActiveMesh();

    if (!activeShape || !activeMesh) {
      return;
    }

    // Left click to paint
    if (event.button === 0) {
      isPainting = true;

      const intersection = raycaster.getIntersectionUV(
        event,
        canvas,
        camera,
        activeMesh
      );

      if (!intersection) {
        lastPaintUV = null;
        currentFaceIndex = undefined;
        return;
      }

      currentFaceIndex = intersection.faceIndex;

      const painter = activeShape.getPainter(intersection.faceIndex);
      if (!painter) {
        lastPaintUV = null;
        return;
      }

      if (uiState.toolMode === "paint") {
        painter.paint(
          intersection.uv.x,
          intersection.uv.y,
          uiState.brushColor,
          uiState.brushSize,
          uiState.brushOpacity,
          uiState.brushType
        );

        activeShape.updateTexture(intersection.faceIndex);
      }

      lastPaintUV = intersection.uv;
    }

    // Right click to rotate
    else if (event.button === 2) {
      isRotating = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    }
  });

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    const activeShape = getActiveShape();
    const activeMesh = getActiveMesh();

    if (!activeShape || !activeMesh) {
      return;
    }

    updateBrushPreview(event);

    // Right click drag rotation
    if (isRotating) {
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;

      activeShape.mesh.rotation.y += deltaX * 0.007;
      activeShape.mesh.rotation.x += deltaY * 0.007;

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;

      return;
    }

    if (!isPainting) {
      return;
    }

    const intersection = raycaster.getIntersectionUV(
      event,
      canvas,
      camera,
      activeMesh
    );

    if (!intersection) {
      return;
    }

    const painter = activeShape.getPainter(intersection.faceIndex);
    if (!painter) {
      return;
    }

    if (
      activeShape.painters.length > 1 &&
      currentFaceIndex !== undefined &&
      intersection.faceIndex !== currentFaceIndex
    ) {
      return;
    }

    if (lastPaintUV) {
      if (uiState.toolMode === "paint") {
        painter.paintStroke(
          lastPaintUV,
          intersection.uv,
          uiState.brushColor,
          uiState.brushSize,
          uiState.brushOpacity,
          uiState.brushType
        );
      } else if (uiState.toolMode === "finger") {
        painter.smudgeStroke(
          lastPaintUV,
          intersection.uv,
          uiState.brushSize,
          0.5
        );
      }

      activeShape.updateTexture(intersection.faceIndex);
    } else if (uiState.toolMode === "paint") {
      painter.paint(
        intersection.uv.x,
        intersection.uv.y,
        uiState.brushColor,
        uiState.brushSize,
        uiState.brushOpacity,
        uiState.brushType
      );

      activeShape.updateTexture(intersection.faceIndex);
    }

    lastPaintUV = intersection.uv;
  });

  window.addEventListener("mouseup", (event: MouseEvent) => {
    if (event.button === 0) {
      isPainting = false;
      lastPaintUV = null;
      currentFaceIndex = undefined;
    }

    if (event.button === 2) {
      isRotating = false;
    }
  });

  canvas.addEventListener("mouseleave", () => {
    isPainting = false;
    isRotating = false;
    lastPaintUV = null;
    currentFaceIndex = undefined;
  });
}