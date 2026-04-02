import { setupScene } from "./scene/setupScene";
import { SceneRaycaster } from "./interaction/raycaster";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("No canvas found");
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

let isPainting = false;

let rotateLeft = false;
let rotateRight = false;
let rotateUp = false;
let rotateDown = false;

painter.paint(0.5, 0.5, "#ff0000", 60, 1);
canvasTexture.needsUpdate = true;

canvas.addEventListener("mousedown", (event: MouseEvent) => {
  isPainting = true;

  const uv = sceneRaycaster.getIntersectionUV(event, canvas, camera, cube);
  if (!uv) {
    return;
  }

  painter.paint(uv.x, uv.y, "#00aaff", 30, 0.9);
  canvasTexture.needsUpdate = true;
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  if (!isPainting) {
    return;
  }

  const uv = sceneRaycaster.getIntersectionUV(event, canvas, camera, cube);
  if (!uv) {
    return;
  }

  painter.paint(uv.x, uv.y, "#00aaff", 30, 0.9);
  canvasTexture.needsUpdate = true;
});

window.addEventListener("mouseup", () => {
  isPainting = false;
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
