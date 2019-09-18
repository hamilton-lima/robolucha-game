import * as BABYLON from "babylonjs";
import { Helper3D } from "./helper3d";

// Create a red box to be used as reference in the arena
export class Box3D {
  ball: BABYLON.Mesh;

  constructor(scene: BABYLON.Scene) {
    
    this.ball = BABYLON.MeshBuilder.CreateBox(
      "box",
      { width: 10, height: 10 },
      scene
    );

    let boxMaterial = new BABYLON.StandardMaterial("material", scene);
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString("#FF0000");
    this.ball.material = boxMaterial;
    this.ball.position.x = 5;
    this.ball.position.z = 5;
    this.ball.isVisible = true;
    this.ball.rotation.x = Helper3D.angle2radian(90);
  }
}
