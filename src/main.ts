import "./style.css";
import * as THREE from "three";
import { setupScene } from "./scene/setupScene";
import { SceneRaycaster } from "./interaction/raycaster";

type ObjectType = "cube" | "sphere";
type ToolMode = "paint" | "finger";
type BrushType = "soft" | "hardbrush" | "spray";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("No canvas found");
}

const objectTypeSelect = document.getElementById("objectType") as HTMLSelectElement;
const toolModeSelect = document.getElementById("toolMode") as HTMLSelectElement;
const brushTypeSelect = document.getElementById("brushType") as HTMLSelectElement;
const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
const brushSizeSlider = document.getElementById("brushSize") as HTMLInputElement;
const brushSizeValue = document.getElementById("brushSizeValue") as HTMLSpanElement;
const brushOpacitySlider = document.getElementById("opacity") as HTMLInputElement;
const brushOpacityValue = document.getElementById("brushOpacityValue") as HTMLSpanElement;

if (
  !objectTypeSelect ||
  !toolModeSelect ||
  !brushTypeSelect ||
  !colorPicker ||
  !brushSizeSlider ||
  !brushSizeValue ||
  !brushOpacitySlider ||
  !brushOpacityValue
) {
  throw new Error("Missing UI controls.");
}

const {
  scene,
  camera,
  renderer,
  controls,
  cube,
  sphere,
  cubePainters,
  spherePainter,
  cubeTextureCanvases,
  sphereTextureCanvas,
  cubeMaterials,
  sphereMaterial
} = setupScene(canvas);

const sceneRaycaster = new SceneRaycaster();

// Painting state
let isPainting = false;
let lastPaintUV: THREE.Vector2 | null = null;
let currentFaceIndex = 0;

// UI state
let currentObjectType: ObjectType = objectTypeSelect.value as ObjectType;
let currentTool: ToolMode = toolModeSelect.value as ToolMode;
let currentBrushType: BrushType = brushTypeSelect.value as BrushType;

// Brush settings
let brushSize = Number(brushSizeSlider.value);
let brushColor = colorPicker.value;
let brushOpacity = Number(brushOpacitySlider.value) / 100.0;

// Rotation state
let rotateLeft = false;
let rotateRight = false;
let rotateUp = false;
let rotateDown = false;




cubeMaterials.forEach((material) => {
  if (material.map) {
    material.map.needsUpdate = true;
  }
});


if (sphereMaterial.map) {
  sphereMaterial.map.needsUpdate = true;
}

function getActiveObject(): THREE.Object3D {
  return currentObjectType === "cube" ? cube : sphere;
}

function updateActiveTexture(faceIndex?: number): void {
  if (currentObjectType === "cube") {
    if (
      faceIndex !== undefined &&
      cubeMaterials[faceIndex] &&
      cubeMaterials[faceIndex].map
    ) {
      cubeMaterials[faceIndex].map!.needsUpdate = true;
    }
  } else {
    if (sphereMaterial.map) {
      sphereMaterial.map.needsUpdate = true;
    }
  }
}

function updateVisibleObject(): void {
  cube.visible = currentObjectType === "cube";
  sphere.visible = currentObjectType === "sphere";
}

updateVisibleObject();

// UI event listeners
objectTypeSelect.addEventListener("change", () => {
  currentObjectType = objectTypeSelect.value as ObjectType;
  updateVisibleObject();
  lastPaintUV = null;
  isPainting = false;
});

toolModeSelect.addEventListener("change", () => {
  currentTool = toolModeSelect.value as ToolMode;
});

brushTypeSelect.addEventListener("change", () => {
  currentBrushType = brushTypeSelect.value as BrushType;
});

colorPicker.addEventListener("input", () => {
  brushColor = colorPicker.value;
});

brushSizeSlider.addEventListener("input", () => {
  brushSize = Number(brushSizeSlider.value);
  brushSizeValue.textContent = brushSizeSlider.value;
});

brushOpacitySlider.addEventListener("input", () => {
  brushOpacity = Number(brushOpacitySlider.value) / 100.0;
  brushOpacityValue.textContent = brushOpacitySlider.value;
});

// Apply brick texture button
const applyBrickBtn = document.getElementById("applyBrickBtn") as HTMLButtonElement | null;
if (applyBrickBtn) {
  applyBrickBtn.addEventListener("click", () => {
    const brickImg = new Image();
    brickImg.src = new URL("./assets/brick.jpg", import.meta.url).href;

    brickImg.onload = () => {
      if (currentObjectType === "cube") {
        cubeTextureCanvases.forEach((textureCanvas) => {
          const ctx = textureCanvas.getCanvas().getContext("2d");
          if (!ctx) return;
          ctx.drawImage(brickImg, 0, 0, 512, 512);
        });

        cubeMaterials.forEach((material) => {
          if (material.map) {
            material.map.needsUpdate = true;
          }
        });
      } else {
        const ctx = sphereTextureCanvas.getCanvas().getContext("2d");
        if (!ctx) return;
        ctx.drawImage(
          brickImg,
          0,
          0,
          sphereTextureCanvas.getWidth(),
          sphereTextureCanvas.getHeight()
        );

        if (sphereMaterial.map) {
          sphereMaterial.map.needsUpdate = true;
        }
      }
    };
  });
}

// Apply fabric texture button
const applyFabricBtn = document.getElementById("applyFabricBtn") as HTMLButtonElement | null;
if (applyFabricBtn) {
  applyFabricBtn.addEventListener("click", () => {
    const fabricImg = new Image();
    fabricImg.src = new URL("./assets/fabric-stripes.jpg", import.meta.url).href;

    fabricImg.onload = () => {
      if (currentObjectType === "cube") {
        cubeTextureCanvases.forEach((textureCanvas) => {
          const ctx = textureCanvas.getCanvas().getContext("2d");
          if (!ctx) return;
          ctx.drawImage(fabricImg, 0, 0, 512, 512);
        });

        cubeMaterials.forEach((material) => {
          if (material.map) {
            material.map.needsUpdate = true;
          }
        });
      } else {
        const ctx = sphereTextureCanvas.getCanvas().getContext("2d");
        if (!ctx) return;
        ctx.drawImage(
          fabricImg,
          0,
          0,
          sphereTextureCanvas.getWidth(),
          sphereTextureCanvas.getHeight()
        );

        if (sphereMaterial.map) {
          sphereMaterial.map.needsUpdate = true;
        }
      }
    };
  });
}

// Mouse events
canvas.addEventListener("mousedown", (event: MouseEvent) => {
  isPainting = true;

  const activeObject = getActiveObject();
  const intersection = sceneRaycaster.getIntersectionUV(
    event,
    canvas,
    camera,
    activeObject
  );

  if (!intersection) {
    lastPaintUV = null;
    return;
  }

  if (currentObjectType === "cube") {
    currentFaceIndex = intersection.faceIndex;

    if (currentTool === "paint") {
      cubePainters[currentFaceIndex].paint(
        intersection.uv.x,
        intersection.uv.y,
        brushColor,
        brushSize,
        brushOpacity,
        currentBrushType
      );
      updateActiveTexture(currentFaceIndex);
    }
  } else {
    if (currentTool === "paint") {
      spherePainter.paint(
        intersection.uv.x,
        intersection.uv.y,
        brushColor,
        brushSize,
        brushOpacity,
        currentBrushType
      );
      updateActiveTexture();
    }
  }

  lastPaintUV = intersection.uv;
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  if (!isPainting) {
    return;
  }

  const activeObject = getActiveObject();
  const intersection = sceneRaycaster.getIntersectionUV(
    event,
    canvas,
    camera,
    activeObject
  );

  if (!intersection) {
    return;
  }

  if (currentObjectType === "cube") {
    if (intersection.faceIndex !== currentFaceIndex) {
      return;
    }

    if (lastPaintUV) {
      if (currentTool === "paint") {
        cubePainters[currentFaceIndex].paintStroke(
          lastPaintUV,
          intersection.uv,
          brushColor,
          brushSize,
          brushOpacity,
          currentBrushType
        );
      } else if (currentTool === "finger") {
        cubePainters[currentFaceIndex].smudgeStroke(
          lastPaintUV,
          intersection.uv,
          brushSize,
          0.5
        );
      }

      updateActiveTexture(currentFaceIndex);
    } else if (currentTool === "paint") {
      cubePainters[currentFaceIndex].paint(
        intersection.uv.x,
        intersection.uv.y,
        brushColor,
        brushSize,
        brushOpacity,
        currentBrushType
      );
      updateActiveTexture(currentFaceIndex);
    }
  } else {
    if (lastPaintUV) {
      if (currentTool === "paint") {
        spherePainter.paintStroke(
          lastPaintUV,
          intersection.uv,
          brushColor,
          brushSize,
          brushOpacity,
          currentBrushType
        );
      } else if (currentTool === "finger") {
        spherePainter.smudgeStroke(
          lastPaintUV,
          intersection.uv,
          brushSize,
          0.5
        );
      }

      updateActiveTexture();
    } else if (currentTool === "paint") {
      spherePainter.paint(
        intersection.uv.x,
        intersection.uv.y,
        brushColor,
        brushSize,
        brushOpacity,
        currentBrushType
      );
      updateActiveTexture();
    }
  }

  lastPaintUV = intersection.uv;
});

window.addEventListener("mouseup", () => {
  isPainting = false;
  lastPaintUV = null;
});

// Keyboard controls for object rotation
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

function animate() {
  requestAnimationFrame(animate);

  const rotationSpeed = 0.02;
  const activeObject = getActiveObject();

  if (rotateLeft) {
    activeObject.rotation.y -= rotationSpeed;
  }
  if (rotateRight) {
    activeObject.rotation.y += rotationSpeed;
  }
  if (rotateUp) {
    activeObject.rotation.x -= rotationSpeed;
  }
  if (rotateDown) {
    activeObject.rotation.x += rotationSpeed;
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
