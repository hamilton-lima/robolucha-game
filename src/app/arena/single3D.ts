import { MeshLoader } from "./mesh.loader";
import * as BABYLON from "babylonjs";

export class Single3D {
  mesh: BABYLON.AbstractMesh;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<BABYLON.AbstractMesh>;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.loading = MeshLoader.load(
      scene,
      "0dot5_wallPiece.babylon",
      "0dot5_wallPiece"
    ).then(mesh => {
      this.mesh = mesh;
      return mesh;
    });
  }

  getDimension(): BABYLON.Vector3 {
    if (this.mesh) {
      const box = this.mesh.getBoundingInfo().boundingBox;
      const size = box.maximum.subtract(box.minimum);
      return size;
    }
    return BABYLON.Vector3.Zero();
  }
}
