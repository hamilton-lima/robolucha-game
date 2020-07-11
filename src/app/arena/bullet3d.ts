import * as BABYLON from "babylonjs";
import { Bullet } from "../watch-match/watch-match.model";
import { Base3D } from "./base3D";
import { ArenaData3D } from "./arena.data3D";

export class Bullet3D extends Base3D {
  getSphere(id: string, data3D: ArenaData3D): BABYLON.Mesh {
    if (!data3D.sphereCache) {
      data3D.sphereCache = this.createSphere(data3D);
    }
    return data3D.sphereCache.clone(id);
  }

  createSphere(data3D: ArenaData3D): BABYLON.Mesh {
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "bullet-cache",
      { diameter: 0.3 },
      null
    );

    const material = new BABYLON.StandardMaterial("material", null);
    material.diffuseColor = BABYLON.Color3.FromHexString("#FF0000");
    sphere.material = material;

    return sphere;
  }

  constructor(data3D: ArenaData3D, position: BABYLON.Vector3, bullet: Bullet) {
    super();
    this.mesh = this.getSphere("bullet-" + bullet.id, data3D);

    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
  }
}
