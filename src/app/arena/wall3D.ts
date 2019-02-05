import * as BABYLON from "babylonjs";

export class Wall3D {
  private parent: BABYLON.Mesh;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  loading: Promise<BABYLON.Mesh>;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.parent = BABYLON.Mesh.CreateBox("scene-parent", 1, scene);
    this.parent.isVisible = false;
    this.loading = this.loadMesh();
  }

  loadMesh() {
    let self = this;
    return new Promise<BABYLON.Mesh>((resolve, reject) => {
      BABYLON.SceneLoader.ImportMesh(
        "",
        "assets/",
        "arena_eachPiece_wall.babylon",
        self.scene,
        function(newMeshes, particleSystems) {
          console.log("[Wall3D] imported mesh", newMeshes);

          newMeshes.forEach(mesh => {
            mesh.parent = self.parent;
          });

          resolve(self.parent);
        }
      );
    });
  }
}
