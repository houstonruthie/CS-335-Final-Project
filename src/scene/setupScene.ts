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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // stronger
  directionalLight.position.set(3, 5, 4);
  scene.add(directionalLight);
  const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(-3, -5, -4);
  scene.add(backLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = false;

  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = true;

  // -----------------------------
  // Cube setup
  // -----------------------------
  const cubeTextureCanvases = Array.from(
    { length: 6 },
    () => new TextureCanvas(512, 512)
  );

  const cubePainters = cubeTextureCanvases.map(
    (textureCanvas) => new Painter(textureCanvas)
  );

  const cubeMaterials = cubeTextureCanvases.map((textureCanvas) => {
    const canvasTexture = new THREE.CanvasTexture(textureCanvas.getCanvas());
    canvasTexture.needsUpdate = true;

    return new THREE.MeshPhongMaterial({
      map: canvasTexture,
      shininess: 100
    });
  });

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
  cube.visible = true;
  scene.add(cube);

  // -----------------------------
  // Sphere setup
  // -----------------------------
  const sphereTextureCanvas = new TextureCanvas(1024, 1024);
  const spherePainter = new Painter(sphereTextureCanvas);

  const sphereCanvasTexture = new THREE.CanvasTexture(
    sphereTextureCanvas.getCanvas()
  );
  sphereCanvasTexture.needsUpdate = true;

  const sphereMaterial = new THREE.MeshPhongMaterial({
  map: sphereCanvasTexture,
  shininess: 100,
  color: 0xdddddd // light gray base
});

  const sphereGeometry = new THREE.SphereGeometry(0.85, 64, 64);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.visible = false;
  scene.add(sphere);

  return {
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
  };
}
