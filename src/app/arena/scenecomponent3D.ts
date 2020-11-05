import * as BABYLON from "babylonjs";
import { Base3D } from "./base3D";

const REGION = "region";
const REGION_Y = 0;
const REGION_HEIGHT = 0.1;

export class SceneComponent3D extends Base3D {
  rotation: number;
  type: string;
  scene: BABYLON.Scene;

  originalW: number;
  originalH: number;
  originalL: number;

  color: string;
  name: string;
  id: number;

  constructor(
    id: number,
    scene: BABYLON.Scene,
    position: BABYLON.Vector3,
    width: number,
    height: number,
    length: number,
    rotation: number,
    type: string,
    color: string,
    alpha: number
  ) {
    super();
    this.id = id;
    this.name = "scenecomponent:" + id;
    this.type = type;

    this.originalW = width;
    this.originalL = length;
    this.originalH = height;

    this.scene = scene;
    this.mesh = this.buildMesh(
      scene,
      this.originalW,
      this.originalH,
      this.originalL
    );

    this.mesh.isVisible = true;
    this.mesh.position = this.validatePosition(position);
    this.rotate(rotation);

    this.color = color;

    let boxMaterial = new BABYLON.StandardMaterial("material", scene);
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString(color);
    boxMaterial.alpha = alpha;

    this.mesh.material = boxMaterial;
  }

  // Height don't apply to "region" type
  validateHeight(input: number): number {
    if (this.type == REGION) {
      return REGION_HEIGHT;
    }

    return input;
  }

  buildMesh(
    scene: BABYLON.Scene,
    width: number,
    height: number,
    length: number
  ): BABYLON.Mesh {
    let result: BABYLON.Mesh;

    // make sure the Height rules are checked
    height = this.validateHeight(height);

    result = BABYLON.MeshBuilder.CreateBox(
      this.name,
      { width: width, height: height, depth: length },
      scene
    );

    result.id = this.id.toString();
    // make sure we can interact with the mesh
    result.isPickable = true;
    return result;
  }

  setType(type: string) {
    // same type nothing to do here
    if (this.type == type) {
      return;
    }

    this.type = type;
    this.recreateMesh();
  }

  recreateMesh() {
    const localMesh = this.buildMesh(
      this.scene,
      this.originalW,
      this.originalH,
      this.originalL
    );

    localMesh.position = this.validatePosition(this.mesh.position);
    localMesh.isVisible = this.mesh.isVisible;
    localMesh.rotation = this.mesh.rotation;
    localMesh.material = this.mesh.material;

    this.mesh.dispose();
    this.mesh = localMesh;
  }

  // Y position don't apply to "region" type
  validatePosition(position: BABYLON.Vector3): BABYLON.Vector3 {
    if (this.type == REGION) {
      return new BABYLON.Vector3(position.x, REGION_Y, position.z);
    }
    return position;
  }

  rotate(rotation: number) {
    this.mesh.rotation.y = rotation;
  }

  setAlpha(alpha: number) {
    this.mesh.material.alpha = alpha;
  }

  resize(width: number, height: number, length: number) {
    // if any of the dimensions were ZERO recreate the mesh
    if (this.originalW == 0 || this.originalH == 0 || this.originalL == 0) {
      this.originalW = width;
      this.originalH = width;
      this.originalL = length;
      this.recreateMesh();
    } else {
      this.mesh.scaling.x = width / this.originalW;
      this.mesh.scaling.z = length / this.originalL;

      if (this.type != REGION) {
        this.mesh.scaling.y = height / this.originalH;
      }
    }
  }

  moveToXYZ(position: BABYLON.Vector3) {
    this.mesh.position = this.validatePosition(position);
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
