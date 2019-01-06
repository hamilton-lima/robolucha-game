import * as BABYLON from "babylonjs";

// Create a red box to be used as reference in the arena
export class Box3D {
  constructor(scene: BABYLON.Scene) {
    let ball = BABYLON.MeshBuilder.CreateBox(
      "ground1",
      { width: 1, height: 1 },
      scene
    );

    let boxMaterial = new BABYLON.StandardMaterial("material", scene);
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString("#FF0000");
    ball.material = boxMaterial;
  }
}
