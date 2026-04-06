import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextureCanvas } from "../painting/textureCanvas";
import { Painter } from "../painting/painter";
import brickTexture from "../assets/brick.jpg";

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

  // Create 6 independent texture canvases (one per cube face)
  const textureCanvases = [
    new TextureCanvas(512, 512),  // Face 0 (right)
    new TextureCanvas(512, 512),  // Face 1 (left)
    new TextureCanvas(512, 512),  // Face 2 (top)
    new TextureCanvas(512, 512),  // Face 3 (bottom)
    new TextureCanvas(512, 512),  // Face 4 (front)
    new TextureCanvas(512, 512)   // Face 5 (back)
  ];

  // Create painters for each canvas
  const painters = textureCanvases.map(tc => new Painter(tc));

  // Create materials for each face
  const materials = textureCanvases.map(tc => {
    const canvasTexture = new THREE.CanvasTexture(tc.getCanvas());
    canvasTexture.needsUpdate = true;
    return new THREE.MeshPhongMaterial({
      map: canvasTexture,
      shininess: 100
    });
  });

  // Create cube with multiple materials (one per face)
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(geometry, materials);
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

  // Load brick texture
  const textureLoader = new THREE.TextureLoader();
  const brickMap = textureLoader.load(brickTexture);

  return {
    scene,
    camera,
    renderer,
    cube,
    controls,
    painters,
    textureCanvases,
    materials,
    brickMap
  };
}