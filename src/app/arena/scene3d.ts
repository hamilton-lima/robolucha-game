import * as BABYLON from "babylonjs";

export class Scene3D {
  private parent: BABYLON.AbstractMesh;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.material = new BABYLON.StandardMaterial("material", scene);
    this.material.diffuseColor = BABYLON.Color3.FromHexString("#619FD7");

    this.parent = BABYLON.Mesh.CreateBox("scene-parent", 1, scene);
    this.parent.isVisible = false;

    let self = this;

    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "arena_02.babylon",
      scene,
      function(newMeshes, particleSystems) {
        console.log("[Scene3D] imported scene", newMeshes);

        newMeshes.forEach(mesh => {
          mesh.parent = self.parent;
        });
      }
    );

    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "scene_room.babylon",
      scene,
      function(newMeshes, particleSystems) {
        console.log("[Scene3D] imported room", newMeshes);

        newMeshes.forEach(mesh => {
          console.log("[Scene3D] imported room", mesh.name);
          mesh.parent = self.parent;
          if (mesh.name == "scene_room") {
            mesh.material = self.material;
          }
        });
      }
    );
  }
}
