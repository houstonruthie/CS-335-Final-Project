import * as THREE from "three";
import { TextureCanvas } from "../painting/textureCanvas";
import { Painter } from "../painting/painter";

export type SceneObjects = {
  cube: THREE.Mesh;
  sphere: THREE.Mesh;
  cubePainters: Painter[];
  spherePainter: Painter;
  cubeTextureCanvases: TextureCanvas[];
  sphereTextureCanvas: TextureCanvas;
  cubeMaterials: THREE.MeshPhongMaterial[];
  sphereMaterial: THREE.MeshPhongMaterial;
};

export function createPaintableObjects(scene: THREE.Scene): SceneObjects {
  const cubeTextureCanvases = Array.from(
    { length: 6 },
    () => new TextureCanvas(512, 512)
  );

  const cubePainters = cubeTextureCanvases.map(
    (textureCanvas) => new Painter(textureCanvas)
  );

  const cubeMaterials = cubeTextureCanvases.map((textureCanvas) => {
    const texture = new THREE.CanvasTexture(textureCanvas.getCanvas());
    texture.needsUpdate = true;

    return new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 100
    });
  });

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
  cube.visible = true;
  scene.add(cube);

  const sphereTextureCanvas = new TextureCanvas(1024, 1024);
  const spherePainter = new Painter(sphereTextureCanvas);

  const sphereCanvasTexture = new THREE.CanvasTexture(
    sphereTextureCanvas.getCanvas()
  );
  sphereCanvasTexture.needsUpdate = true;

  const sphereMaterial = new THREE.MeshPhongMaterial({
    map: sphereCanvasTexture,
    shininess: 100,
    color: 0xdddddd
  });

  const sphereGeometry = new THREE.SphereGeometry(0.85, 64, 64);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.visible = false;
  scene.add(sphere);

  return {
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