import * as BABYLON from "babylonjs";
import { FindValueSubscriber } from "rxjs/internal/operators/find";

export class Single3D {
  private mesh: BABYLON.AbstractMesh;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<BABYLON.AbstractMesh>;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.loading = this.loadMesh();
  }

  loadMesh() {
    let self = this;
    return new Promise<BABYLON.AbstractMesh>((resolve, reject) => {
      BABYLON.SceneLoader.ImportMeshAsync(
        "",
        "assets/",
        "0dot5_wallPiece.babylon",
        self.scene
      ).then(
        (value: {
          meshes: BABYLON.AbstractMesh[];
          particleSystems: BABYLON.IParticleSystem[];
          skeletons: BABYLON.Skeleton[];
          animationGroups: BABYLON.AnimationGroup[];
        }) => {
          self.mesh = value.meshes[0];
          self.mesh.isVisible = false;
          resolve(self.mesh);
        }
      );
    });
  }
}
