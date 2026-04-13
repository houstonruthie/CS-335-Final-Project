import "./style.css";
import * as THREE from "three";
import { setupScene } from "./scene/setupScene";
import { SceneRaycaster } from "./interaction/raycaster";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
    throw new Error("No canvas found");
}

const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
const brushSizeSlider = document.getElementById("brushSize") as HTMLInputElement;
const brushSizeValue = document.getElementById("brushSizeValue") as HTMLSpanElement;
const brushOpacitySlider = document.getElementById("opacity") as HTMLInputElement;
const brushOpacityValue = document.getElementById("brushOpacityValue") as HTMLSpanElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const undoBtn = document.getElementById("undoBtn") as HTMLButtonElement;
const redoBtn = document.getElementById("redoBtn") as HTMLButtonElement;

if (!colorPicker || !brushSizeSlider || !brushSizeValue) {
    throw new Error("Missing UI controls.");
}

const {
    scene,
    camera,
    renderer,
    cube,
    controls,
    painter,
    canvasTexture
} = setupScene(canvas);

const sceneRaycaster = new SceneRaycaster();

// Painting state
let isPainting = false;
let lastPaintUV: THREE.Vector2 | null = null;

// Brush settings
let brushSize = Number(brushSizeSlider.value);
let brushColor = colorPicker.value;
let brushOpacity = 1.0;

// Rotation state
let rotateLeft = false;
let rotateRight = false;
let rotateUp = false;
let rotateDown = false;

// stacks for undo and redo
let undoStack: ImageData[] = [];
let redoStack: ImageData[] = [];

// Initial paint
painter.paint(0.5, 0.5, "#ff0000", 60, 1);
canvasTexture.needsUpdate = true;

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

// Mouse events
canvas.addEventListener("mousedown", (event: MouseEvent) => {
    isPainting = true;

    const uv = sceneRaycaster.getIntersectionUV(event, canvas, camera, cube);
    if (!uv) {
        lastPaintUV = null;
        return;
    }

    painter.paint(uv.x, uv.y, brushColor, brushSize, brushOpacity);
    canvasTexture.needsUpdate = true;
    lastPaintUV = uv;
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
    if (!isPainting) {
        return;
    }

    // capture state before painting for undo stack
    const snapshot = painter.getTextureCanvas().getImageData();
    undoStack.push(snapshot);

    // Clear redo stack 
    redoStack = [];

    const uv = sceneRaycaster.getIntersectionUV(event, canvas, camera, cube);
    if (!uv) {
        return;
    }

    if (lastPaintUV) {
        painter.paintStroke(lastPaintUV, uv, brushColor, brushSize, brushOpacity);
    } else {
        painter.paint(uv.x, uv.y, brushColor, brushSize, brushOpacity);
    }

    canvasTexture.needsUpdate = true;
    lastPaintUV = uv;
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


clearBtn.addEventListener("click", () => {
    const isConfirmed: boolean = window.confirm("Are you sure you want to clear your texture?");

    if (isConfirmed) {
        painter.clear();
        canvasTexture.needsUpdate = true;
    } else {
        console.log("User clicked Cancel");
    }
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
            redo(); // Ctrl + Shift + Z
        } else {
            undo(); // Ctrl + Z
        }
    }
});

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

function undo() {
    if (undoStack.length === 0) return;

    const current = painter.getTextureCanvas().getImageData();
    redoStack.push(current);

    const previous = undoStack.pop()!;
    painter.getTextureCanvas().setImageData(previous);
    canvasTexture.needsUpdate = true;
}

function redo() {
    if (redoStack.length === 0) return;

    const current = painter.getTextureCanvas().getImageData();
    undoStack.push(current);

    const next = redoStack.pop()!;
    painter.getTextureCanvas().setImageData(next);
    canvasTexture.needsUpdate = true;
}
