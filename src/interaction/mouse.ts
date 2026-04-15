import * as THREE from "three";
import { SceneRaycaster } from "./raycaster";
import type { SceneObjects } from "../scene/objects";
import type { UIState } from "../ui/controls";

type MouseControllerDeps = {
  canvas: HTMLCanvasElement;
  camera: THREE.Camera;
  raycaster: SceneRaycaster;
  sceneObjects: SceneObjects;
  uiState: UIState;
  updateTexture: (faceIndex?: number) => void;
  updateBrushPreview: (event: MouseEvent) => void;
};

export function setupMousePainting({
  canvas,
  camera,
  raycaster,
  sceneObjects,
  uiState,
  updateTexture,
  updateBrushPreview
}: MouseControllerDeps): void {
  let isPainting = false;
  let lastPaintUV: THREE.Vector2 | null = null;
  let currentFaceIndex = 0;

  function getActiveObject(): THREE.Object3D {
    return uiState.objectType === "cube" ? sceneObjects.cube : sceneObjects.sphere;
  }

  canvas.addEventListener("mousedown", (event: MouseEvent) => {
    isPainting = true;

    const intersection = raycaster.getIntersectionUV(
      event,
      canvas,
      camera,
      getActiveObject()
    );

    if (!intersection) {
      lastPaintUV = null;
      return;
    }

    if (uiState.objectType === "cube") {
      currentFaceIndex = intersection.faceIndex;

      if (uiState.toolMode === "paint") {
        sceneObjects.cubePainters[currentFaceIndex].paint(
          intersection.uv.x,
          intersection.uv.y,
          uiState.brushColor,
          uiState.brushSize,
          uiState.brushOpacity,
          uiState.brushType
        );
        updateTexture(currentFaceIndex);
      }
    } else {
      if (uiState.toolMode === "paint") {
        sceneObjects.spherePainter.paint(
          intersection.uv.x,
          intersection.uv.y,
          uiState.brushColor,
          uiState.brushSize,
          uiState.brushOpacity,
          uiState.brushType
        );
        updateTexture();
      }
    }

    lastPaintUV = intersection.uv;
  });

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    updateBrushPreview(event);

    if (!isPainting) {
      return;
    }

    const intersection = raycaster.getIntersectionUV(
      event,
      canvas,
      camera,
      getActiveObject()
    );

    if (!intersection) {
      return;
    }

    if (uiState.objectType === "cube") {
      if (intersection.faceIndex !== currentFaceIndex) {
        return;
      }

      if (lastPaintUV) {
        if (uiState.toolMode === "paint") {
          sceneObjects.cubePainters[currentFaceIndex].paintStroke(
            lastPaintUV,
            intersection.uv,
            uiState.brushColor,
            uiState.brushSize,
            uiState.brushOpacity,
            uiState.brushType
          );
        } else {
          sceneObjects.cubePainters[currentFaceIndex].smudgeStroke(
            lastPaintUV,
            intersection.uv,
            uiState.brushSize,
            0.5
          );
        }

        updateTexture(currentFaceIndex);
      } else if (uiState.toolMode === "paint") {
        sceneObjects.cubePainters[currentFaceIndex].paint(
          intersection.uv.x,
          intersection.uv.y,
          uiState.brushColor,
          uiState.brushSize,
          uiState.brushOpacity,
          uiState.brushType
        );
        updateTexture(currentFaceIndex);
      }
    } else {
      if (lastPaintUV) {
        if (uiState.toolMode === "paint") {
          sceneObjects.spherePainter.paintStroke(
            lastPaintUV,
            intersection.uv,
            uiState.brushColor,
            uiState.brushSize,
            uiState.brushOpacity,
            uiState.brushType
          );
        } else {
          sceneObjects.spherePainter.smudgeStroke(
            lastPaintUV,
            intersection.uv,
            uiState.brushSize,
            0.5
          );
        }

        updateTexture();
      } else if (uiState.toolMode === "paint") {
        sceneObjects.spherePainter.paint(
          intersection.uv.x,
          intersection.uv.y,
          uiState.brushColor,
          uiState.brushSize,
          uiState.brushOpacity,
          uiState.brushType
        );
        updateTexture();
      }
    }

    lastPaintUV = intersection.uv;
  });

  canvas.addEventListener("mouseleave", () => {
    updateBrushPreview(new MouseEvent("mousemove", { clientX: -9999, clientY: -9999 }));
  });

  window.addEventListener("mouseup", () => {
    isPainting = false;
    lastPaintUV = null;
  });
}