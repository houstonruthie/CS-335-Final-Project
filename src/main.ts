import "./style.css";
import * as THREE from "three";
import { setupScene } from "./scene/setupScene";
import { SceneRaycaster } from "./interaction/raycaster";

type ToolMode = "paint" | "finger";
type BrushType = "soft" | "hardbrush" | "spray";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("No canvas found");
}

const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
const brushSizeSlider = document.getElementById("brushSize") as HTMLInputElement;
const brushSizeValue = document.getElementById("brushSizeValue") as HTMLSpanElement;
const brushOpacitySlider = document.getElementById("opacity") as HTMLInputElement;
const brushOpacityValue = document.getElementById("brushOpacityValue") as HTMLSpanElement;
const toolModeSelect = document.getElementById("toolMode") as HTMLSelectElement;
const brushTypeSelect = document.getElementById("brushType") as HTMLSelectElement;

if (
  !colorPicker ||
  !brushSizeSlider ||
  !brushSizeValue ||
  !brushOpacitySlider ||
  !brushOpacityValue ||
  !toolModeSelect ||
  !brushTypeSelect
) {
  throw new Error("Missing UI controls.");
}

const {
  scene,
  camera,
  renderer,
  cube,
  controls,
  painters,
  textureCanvases,
  materials
} = setupScene(canvas);

const sceneRaycaster = new SceneRaycaster();

// Painting state
let isPainting = false;
let lastPaintUV: THREE.Vector2 | null = null;
let currentFaceIndex = 0;

// Brush settings
let brushSize = Number(brushSizeSlider.value);
let brushColor = colorPicker.value;
let brushOpacity = Number(brushOpacitySlider.value) / 100.0;
let currentTool: ToolMode = toolModeSelect.value as ToolMode;
let currentBrushType: BrushType = brushTypeSelect.value as BrushType;

// Rotation state
let rotateLeft = false;
let rotateRight = false;
let rotateUp = false;
let rotateDown = false;

// Initial paint on each face
painters.forEach((painter) => {
  painter.paint(0.5, 0.5, "#ff0000", 60, 1, "soft");
});

materials.forEach((material) => {
  if (material.map) {
    material.map.needsUpdate = true;
  }
});

// UI event listeners
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

toolModeSelect.addEventListener("change", () => {
  currentTool = toolModeSelect.value as ToolMode;
});

brushTypeSelect.addEventListener("change", () => {
  currentBrushType = brushTypeSelect.value as BrushType;
});

// Apply brick texture button
const applyBrickBtn = document.getElementById("applyBrickBtn") as HTMLButtonElement | null;
if (applyBrickBtn) {
  applyBrickBtn.addEventListener("click", () => {
    const brickImg = new Image();
    brickImg.src = new URL("./assets/brick.jpg", import.meta.url).href;

    brickImg.onload = () => {
      textureCanvases.forEach((textureCanvas) => {
        const ctx = textureCanvas.getCanvas().getContext("2d");
        if (!ctx) return;
        ctx.drawImage(brickImg, 0, 0, 512, 512);
      });

      materials.forEach((material) => {
        if (material.map) {
          material.map.needsUpdate = true;
        }
      });
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
      textureCanvases.forEach((textureCanvas) => {
        const ctx = textureCanvas.getCanvas().getContext("2d");
        if (!ctx) return;
        ctx.drawImage(fabricImg, 0, 0, 512, 512);
      });

      materials.forEach((material) => {
        if (material.map) {
          material.map.needsUpdate = true;
        }
      });
    };
  });
}

// Mouse events
canvas.addEventListener("mousedown", (event: MouseEvent) => {
  isPainting = true;

  const intersection = sceneRaycaster.getIntersectionUV(event, canvas, camera, cube);
  if (!intersection) {
    lastPaintUV = null;
    return;
  }

  currentFaceIndex = intersection.faceIndex;

  if (currentTool === "paint") {
    painters[currentFaceIndex].paint(
      intersection.uv.x,
      intersection.uv.y,
      brushColor,
      brushSize,
      brushOpacity,
      currentBrushType
    );

    if (materials[currentFaceIndex].map) {
      materials[currentFaceIndex].map!.needsUpdate = true;
    }
  }

  lastPaintUV = intersection.uv;
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  if (!isPainting) {
    return;
  }

  const intersection = sceneRaycaster.getIntersectionUV(event, canvas, camera, cube);
  if (!intersection) {
    return;
  }

  if (intersection.faceIndex !== currentFaceIndex) {
    return;
  }

  if (lastPaintUV) {
    if (currentTool === "paint") {
      painters[currentFaceIndex].paintStroke(
        lastPaintUV,
        intersection.uv,
        brushColor,
        brushSize,
        brushOpacity,
        currentBrushType
      );
    } else if (currentTool === "finger") {
      painters[currentFaceIndex].smudgeStroke(
        lastPaintUV,
        intersection.uv,
        brushSize,
        0.5
      );
    }

    if (materials[currentFaceIndex].map) {
      materials[currentFaceIndex].map!.needsUpdate = true;
    }
  } else {
    if (currentTool === "paint") {
      painters[currentFaceIndex].paint(
        intersection.uv.x,
        intersection.uv.y,
        brushColor,
        brushSize,
        brushOpacity,
        currentBrushType
      );

      if (materials[currentFaceIndex].map) {
        materials[currentFaceIndex].map!.needsUpdate = true;
      }
    }
  }

  lastPaintUV = intersection.uv;
});

window.addEventListener("mouseup", () => {
  isPainting = false;
  lastPaintUV = null;
});

// Keyboard controls for cube rotation
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

  if (rotateLeft) {
    cube.rotation.y -= rotationSpeed;
  }
  if (rotateRight) {
    cube.rotation.y += rotationSpeed;
  }
  if (rotateUp) {
    cube.rotation.x -= rotationSpeed;
  }
  if (rotateDown) {
    cube.rotation.x += rotationSpeed;
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
