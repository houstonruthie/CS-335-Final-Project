import * as THREE from "three";
import type { PaintableShape } from "../shapeTypes";
import { TextureCanvas } from "../../painting/textureCanvas";
import { Painter } from "../../painting/painter";

export function createCone(): PaintableShape {
  const textureCanvas = new TextureCanvas(1024, 1024);
  const painter = new Painter(textureCanvas);

  const texture = new THREE.CanvasTexture(textureCanvas.getCanvas());
  texture.needsUpdate = true;

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 100,
    color: 0xdddddd
  });

  const geometry = new THREE.ConeGeometry(0.75, 1.5, 64, 1, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;

  return {
    key: "cone",
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