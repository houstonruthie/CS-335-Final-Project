import * as THREE from "three";
import type { PaintableShape } from "../shapeTypes";
import { TextureCanvas } from "../../painting/textureCanvas";
import { Painter } from "../../painting/painter";

export function createTorus(): PaintableShape {
  const textureCanvas = new TextureCanvas(1024, 1024);
  const painter = new Painter(textureCanvas);

  const texture = new THREE.CanvasTexture(textureCanvas.getCanvas());
  texture.needsUpdate = true;

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 100,
    color: 0xdddddd
  });

  const geometry = new THREE.TorusGeometry(0.65, 0.25, 32, 100);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;

  return {
    key: "torus",
    mesh,
    painters: [painter],
    textureCanvases: [textureCanvas],
    materials: [material],

    getPainter(): Painter {
      return painter;
    },

    updateTexture(): void {
      if (material.map) {
        material.map.needsUpdate = true;
      }
    },

    setVisible(visible: boolean): void {
      mesh.visible = visible;
    }
  };
}