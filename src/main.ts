import * as THREE from "three";
import { setupMousePainting } from "./interaction/mouse";
import { SceneRaycaster } from "./interaction/raycaster";
import { setupScene } from "./scene/setupScene";
import "./style.css";
import { bindUIState, bindUiPanelToggle, createUIState, getUIElements } from "./ui/controls";
import { bindTextureButtons, bindTextureUpload } from "./ui/textures";
import { ROTATION_SPEED } from "./utils/constants";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("No canvas found");
}
const ui = getUIElements();
const uiState = createUIState(ui);

bindUiPanelToggle();

const { scene, camera, renderer, controls, shapeManager } = setupScene(canvas);

const sceneRaycaster = new SceneRaycaster();

let undoStack: ImageData[] = [];
let redoStack: ImageData[] = [];

let rotateLeft = false;
let rotateRight = false;
let rotateUp = false;
let rotateDown = false;

const previewGeometry = new THREE.RingGeometry(0.02, 0.025, 40);
const previewMaterial = new THREE.MeshBasicMaterial({
  color: 0x111111,
  transparent: true,
  opacity: 0.75,
  side: THREE.DoubleSide
});
const brushPreview = new THREE.Mesh(previewGeometry, previewMaterial);
brushPreview.visible = false;
scene.add(brushPreview);

const previewRaycaster = new THREE.Raycaster();
const previewMouse = new THREE.Vector2();

function getActiveObject(): THREE.Object3D | null {
  const activeShape = shapeManager.getActiveShape();
  return activeShape ? activeShape.mesh : null;
}

function updateVisibleObject(): void {
  shapeManager.setActiveShape(uiState.shapeType);
  brushPreview.visible = false;
}

function updateBrushPreview(event: MouseEvent): void {
  const activeObject = getActiveObject();
  if (!activeObject) {
    brushPreview.visible = false;
    return;
  }

  const rect = canvas.getBoundingClientRect();

  previewMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  previewMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  previewRaycaster.setFromCamera(previewMouse, camera);
  const intersects = previewRaycaster.intersectObject(activeObject);

  if (intersects.length === 0) {
    brushPreview.visible = false;
    return;
  }

  const hit = intersects[0];
  if (!hit.point || !hit.face?.normal) {
    brushPreview.visible = false;
    return;
  }

  const normal = hit.face.normal.clone();
  const worldNormal = normal.transformDirection(activeObject.matrixWorld);
  const previewPosition = hit.point.clone().add(worldNormal.multiplyScalar(0.01));

  brushPreview.position.copy(previewPosition);

  const lookTarget = previewPosition.clone().add(worldNormal);
  brushPreview.lookAt(lookTarget);

  const scale = uiState.brushSize * 0.025;
  brushPreview.scale.set(scale, scale, scale);

  brushPreview.visible = true;
}

bindUIState(ui, uiState, updateVisibleObject);
updateVisibleObject();

bindTextureButtons({
  shapeManager
});

bindTextureUpload({
  shapeManager
});

setupMousePainting({
    canvas,
    camera,
    raycaster: sceneRaycaster,
    shapeManager,
    uiState,
    updateBrushPreview,
    undoStack,
    redoStack
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    rotateLeft = true;
  } else if (event.key === "ArrowRight") {
    rotateRight = true;
  } else if (event.key === "ArrowUp") {
    rotateUp = true;
  } else if (event.key === "ArrowDown") {
    rotateDown = true;
  }
});

window.addEventListener("keyup", (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    rotateLeft = false;
  } else if (event.key === "ArrowRight") {
    rotateRight = false;
  } else if (event.key === "ArrowUp") {
    rotateUp = false;
  } else if (event.key === "ArrowDown") {
    rotateDown = false;
  }
});

function animate(): void {
  requestAnimationFrame(animate);

  const activeObject = getActiveObject();

  if (activeObject) {
    if (rotateLeft) {
      activeObject.rotation.y -= ROTATION_SPEED;
    }
    if (rotateRight) {
      activeObject.rotation.y += ROTATION_SPEED;
    }
    if (rotateUp) {
      activeObject.rotation.x -= ROTATION_SPEED;
    }
    if (rotateDown) {
      activeObject.rotation.x += ROTATION_SPEED;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;

clearBtn.addEventListener("click", () => {
    const activeShape = shapeManager.getActiveShape();
    if (!activeShape) return;

    activeShape.textureCanvases.forEach((textureCanvas) => {
        textureCanvas.clear();
    });

    activeShape.materials.forEach((material) => {
        if (material.map) {
            material.map.needsUpdate = true;
        }
    });
});

const undoBtn = document.getElementById("undoBtn") as HTMLButtonElement;
function undo(): void {
    const activeShape = shapeManager.getActiveShape();
    if (!activeShape || undoStack.length === 0) return;

    const tc = activeShape.textureCanvases[0];
    const ctx = tc.getCanvas().getContext("2d");
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, tc.getWidth(), tc.getHeight());
    redoStack.push(current);

    const prev = undoStack.pop()!;
    ctx.putImageData(prev, 0, 0);

    activeShape.materials.forEach((m) => {
        if (m.map) m.map.needsUpdate = true;
    });
}

const redoBtn = document.getElementById("redoBtn") as HTMLButtonElement;

function redo(): void {
    const activeShape = shapeManager.getActiveShape();
    if (!activeShape || redoStack.length === 0) return;

    const tc = activeShape.textureCanvases[0];
    const ctx = tc.getCanvas().getContext("2d");
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, tc.getWidth(), tc.getHeight());
    undoStack.push(current);

    const next = redoStack.pop()!;
    ctx.putImageData(next, 0, 0);

    activeShape.materials.forEach((m) => {
        if (m.map) m.map.needsUpdate = true;
    });
}

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
            redo();
        } else {
            undo();
        }
    }
});
