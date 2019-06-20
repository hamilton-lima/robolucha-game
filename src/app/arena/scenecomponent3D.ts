import * as BABYLON from "babylonjs";
import { Base3D } from "./base3D";
import { Helper3D } from "./helper3d";

export class SceneComponent3D extends Base3D {
  rotation: number;
  type: string;
  originalW: number;
  originalH: number;
  color: string;

  constructor(
    id: number,
    scene: BABYLON.Scene,
    position: BABYLON.Vector3,
    w: number,
    h: number,
    rotation: number,
    type: string,
    color: string,
    alpha: number
  ) {
    super();
    const name = "component" + id;

    if( type == "wall"){
      this.mesh = BABYLON.MeshBuilder.CreateBox(
        name,
        { width: w, height: h, depth: 3 },
        scene
      );

    } else {
      this.mesh = BABYLON.MeshBuilder.CreatePlane(
        name,
        { width: w, height: h },
        scene
      );
    }


    this.originalH = h;
    this.originalW = w;

    this.mesh.isVisible = true;
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;

    this.mesh.rotation.x = Helper3D.angle2radian(90);

    this.rotation = rotation;
    this.type = type;
    this.color = color;

    let boxMaterial = new BABYLON.StandardMaterial("material", scene);
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString(color);
    boxMaterial.alpha = alpha;

    this.mesh.material = boxMaterial;
  }

  resize(width: number, height: number) {
    this.mesh.scaling.x = width / this.originalW;
    this.mesh.scaling.y = height / this.originalH;
  }

  setColor(color: string) {
    if (color !== this.color) {
      this.color = color;
      (<BABYLON.StandardMaterial>(
        this.mesh.material
      )).diffuseColor = BABYLON.Color3.FromHexString(color);
    }
  }
}
