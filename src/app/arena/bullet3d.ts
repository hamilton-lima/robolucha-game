import * as BABYLON from "babylonjs";
import { Bullet } from "../watch-match/watch-match.model";
import { Base3D } from "./base3D";

export class Bullet3D extends Base3D{
  
  constructor(scene: BABYLON.Scene, position: BABYLON.Vector3, bullet: Bullet) {
    super();
    this.scene = scene;

    this.mesh = BABYLON.MeshBuilder.CreateSphere(
      "bullet-" + bullet.id,
      { diameter: 0.3 },
      scene
    );

    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;

    let material = new BABYLON.StandardMaterial("material", scene);
    material.diffuseColor = BABYLON.Color3.FromHexString("#FF0000");
    this.mesh.material = material;
  }
 
}
