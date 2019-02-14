import * as BABYLON from "babylonjs";
import { MeshLoader } from "./mesh.loader";

export class GroundTile3D {
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<BABYLON.AbstractMesh>;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.loading = MeshLoader.load(
      scene,
      '2x2_arenaFloor.babylon',
      '2x2_arena_floor_00'
    );
  }

}
