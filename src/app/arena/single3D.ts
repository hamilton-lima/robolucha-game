import { MeshLoader } from './mesh.loader';
import * as BABYLON from 'babylonjs';

export class Single3D {
  private mesh: BABYLON.AbstractMesh;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<BABYLON.AbstractMesh>;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.loading = MeshLoader.load(
      scene,
      '0dot5_wallPiece.babylon',
      '0dot5_wallPiece'
    );
  }
}
