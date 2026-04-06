import * as THREE from "three";

export class SceneRaycaster {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  public getIntersectionUV(
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    camera: THREE.Camera,
    object: THREE.Object3D
  ): { uv: THREE.Vector2; faceIndex: number } | null {
    const rect = canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);

    const intersects = this.raycaster.intersectObject(object);

    if (intersects.length === 0) {
      return null;
    }

    const hit = intersects[0];

    if (!hit.uv || hit.face == null) {
      return null;
    }

    // Get material index which corresponds to cube face
    const faceIndex = hit.face.materialIndex !== undefined ? hit.face.materialIndex : 0;

    return {
      uv: hit.uv.clone(),
      faceIndex: faceIndex
    };
  }
}