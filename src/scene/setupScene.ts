import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextureCanvas } from "../painting/textureCanvas";
import { Painter } from "../painting/painter";

export function setupScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const textureCanvas = new TextureCanvas(1024, 1024);
  const painter = new Painter(textureCanvas);

  const canvasTexture = new THREE.CanvasTexture(textureCanvas.getCanvas());
  canvasTexture.needsUpdate = true;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    map: canvasTexture,
    shininess: 100
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = false;

  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = true;

  return {
    scene,
    camera,
    renderer,
    cube,
    controls,
    painter,
    canvasTexture
  };
}