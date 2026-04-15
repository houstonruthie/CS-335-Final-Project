import * as THREE from "three";
import type { PaintableShape } from "../shapeTypes";
import { TextureCanvas } from "../../painting/textureCanvas";
import { Painter } from "../../painting/painter";

export function createCube(): PaintableShape {
  const textureCanvases = Array.from({ length: 6 }, () => new TextureCanvas(512, 512));
  const painters = textureCanvases.map((canvas) => new Painter(canvas));

  const materials = textureCanvases.map((textureCanvas) => {
    const texture = new THREE.CanvasTexture(textureCanvas.getCanvas());
    texture.needsUpdate = true;

    return new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 100
    });
  });

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, materials);

  return {
    key: "cube",
    mesh,
    painters,
    textureCanvases,
    materials,
    getPainter(faceIndex?: number) {
      if (faceIndex == null) return null;
      return painters[faceIndex] ?? null;
    },
    updateTexture(faceIndex?: number) {
      if (faceIndex == null) return;
      const material = materials[faceIndex];
      if (material?.map) {
        material.map.needsUpdate = true;
      }
    },
    setVisible(visible: boolean) {
      mesh.visible = visible;
    }
  };
}