import * as BABYLON from "babylonjs";
import { Base3D } from "./base3D";

export class SceneComponent3D extends Base3D {
  rotation: number;
  type: string;
  scene: BABYLON.Scene;
  originalW: number;
  originalH: number;
  color: string;
  name: string;
  id: number;

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
    this.id = id;
    this.name = "scenecomponent:" + id;

    this.originalH = h;
    this.originalW = w;
    this.scene = scene;

    this.mesh = this.buildMesh(scene, type, w, h);
    this.mesh.isVisible = true;
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
    this.rotate(rotation);

    this.rotation = rotation;
    this.type = type;
    this.color = color;

    let boxMaterial = new BABYLON.StandardMaterial("material", scene);
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString(color);
    boxMaterial.alpha = alpha;

    this.mesh.material = boxMaterial;
  }

  buildMesh(scene: BABYLON.Scene, type: string, w: number, h: number): BABYLON.Mesh {
    let result: BABYLON.Mesh;

    if (type == "wall") {
      result = BABYLON.MeshBuilder.CreateBox(
        this.name,
        { width: w, height: h, depth: 3 },
        scene
      );
    } else {
      result = BABYLON.MeshBuilder.CreatePlane(
        this.name,
        { width: w, height: h },
        scene
      );
    }

    result.id = this.id.toString();
    result.isPickable = true;
    return result;
  }

  setType(type: string) {
    // same type nothing to do here
    if( this.type == type){
      return;
    }
    const localMesh = this.buildMesh(this.scene, type, this.originalW, this.originalH);

    localMesh.isVisible = this.mesh.isVisible;
    localMesh.position = this.mesh.position;
    localMesh.rotation = this.mesh.rotation;
    localMesh.material = this.mesh.material;

    this.mesh.dispose();
    this.mesh = localMesh;
    this.type = type;
  }

  rotate(rotation: number) {
    this.mesh.rotation.y = rotation;
  }

  setAlpha(alpha: number) {
    this.mesh.material.alpha = alpha;
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
