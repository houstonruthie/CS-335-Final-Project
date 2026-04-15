import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createCamera } from "./camera";
import { addLights } from "./lights";
import { ShapeManager } from "./shapeManager";

// Shapes
import { createCube } from "./shapes/createCube";
import { createSphere } from "./shapes/createSphere";
import { createCylinder } from "./shapes/createCylinder";
import { createCone } from "./shapes/createCone";
import { createTorus } from "./shapes/createTorus";

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

  const shapeManager = new ShapeManager(scene, [
    createCube(),
    createSphere(),
    createCylinder(),
    createCone(),
    createTorus()
  ]);

  return {
    scene,
    camera,
    renderer,
    controls,
    shapeManager
  };
}