import * as BABYLON from "babylonjs";
import { Base3D } from "./base3D";
import { Helper3D } from "./helper3d";

// Create a red box to be used as reference in the arena
export class SceneComponent3D extends Base3D{
  rotation: number;
  type: string;
  originalW: number;
  originalH: number;

  constructor(
    id: number,
    scene: BABYLON.Scene,
    position: BABYLON.Vector3,
    w: number,
    h: number,
    rotation: number,
    type: string
  ) {
    super();
    const name = "component" + id;

    this.mesh = BABYLON.MeshBuilder.CreatePlane(
      name,
      { width: w, height: h },
      scene
    );

    this.originalH = h;
    this.originalW = w;

    this.mesh.isVisible = true;
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;

    console.log("---- 3D component (2)", this.mesh.position, position);

    this.mesh.rotation.x = Helper3D.angle2radian(90);

    this.rotation = rotation;
    this.type = type;

    let boxMaterial = new BABYLON.StandardMaterial("material", scene);
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString("#FF0000");
    this.mesh.material = boxMaterial;
  }

  resize(width: number, height: number) {
    this.mesh.scaling.x = width / this.originalW;
    this.mesh.scaling.y = height / this.originalH;
    console.log("scaling", this.mesh.scaling);
  }

}
