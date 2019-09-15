import * as BABYLON from "babylonjs";
import { MeshLoader } from "./mesh.loader";

export class SquareCenter3D {
  private mesh: BABYLON.AbstractMesh;

  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<BABYLON.AbstractMesh[]>;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.loading = MeshLoader.loadAllMeshes(
      scene,
      "dummy/3DTile_squareCenter_land_Dummytest01.babylon",
      "3DTile_squareCenter_land",
      true
    );
  }
}
