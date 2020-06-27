import * as BABYLON from "babylonjs";
import { Bullet } from "../watch-match/watch-match.model";
import { Base3D } from "./base3D";

export class Bullet3D extends Base3D {
  static sphereCache: BABYLON.Mesh;
  static material: BABYLON.StandardMaterial;

  static init() {
    Bullet3D.material = new BABYLON.StandardMaterial("material", null);
    Bullet3D.material.diffuseColor = BABYLON.Color3.FromHexString("#FF0000");
  }

  getSphere(id: string) {
    if (!Bullet3D.sphereCache) {
      Bullet3D.sphereCache = BABYLON.MeshBuilder.CreateSphere(
        "bullet-cache",
        { diameter: 0.3 },
        null
      );
    }
    return Bullet3D.sphereCache.clone(id, null);
  }

  constructor(scene: BABYLON.Scene, position: BABYLON.Vector3, bullet: Bullet) {
    super();
    if (!Bullet3D.material) {
      Bullet3D.init();
    }

    this.scene = scene;
    this.mesh = this.getSphere("bullet-" + bullet.id);

    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;

    this.mesh.material = Bullet3D.material;
  }
}
