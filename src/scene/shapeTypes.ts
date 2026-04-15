import * as THREE from "three";
import { Painter } from "../painting/painter";
import { TextureCanvas } from "../painting/textureCanvas";

export type PaintableShape = {
  key: string;
  mesh: THREE.Mesh;
  painters: Painter[];
  textureCanvases: TextureCanvas[];
  materials: THREE.MeshPhongMaterial[];
  getPainter: (faceIndex?: number) => Painter | null;
  updateTexture: (faceIndex?: number) => void;
  setVisible: (visible: boolean) => void;
};