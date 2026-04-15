import * as THREE from "three";
import type { PaintableShape } from "../shapeTypes";
import { TextureCanvas } from "../../painting/textureCanvas";
import { Painter } from "../../painting/painter";

export function createSphere(): PaintableShape {
  const textureCanvas = new TextureCanvas(1024, 1024);
  const painter = new Painter(textureCanvas);

  const texture = new THREE.CanvasTexture(textureCanvas.getCanvas());
  texture.needsUpdate = true;

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 100,
    color: 0xdddddd
  });

  const geometry = new THREE.SphereGeometry(0.85, 64, 64);
  const mesh = new THREE.Mesh(geometry, material);

  return {
    key: "sphere",
    mesh,
    painters: [painter],
    textureCanvases: [textureCanvas],
    materials: [material],
    getPainter() {
      return painter;
    },
    updateTexture() {
      if (material.map) {
        material.map.needsUpdate = true;
      }
    },
    setVisible(visible: boolean) {
      mesh.visible = visible;
    }
  };
}