import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { createPaintableObjects } from "./objects";

export function setupScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  const camera = createCamera();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  addLights(scene);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = false;
  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = true;

  const objects = createPaintableObjects(scene);

  return {
    scene,
    camera,
    renderer,
    controls,
    ...objects
  };
}