import * as BABYLON from "babylonjs";
import { Base3D } from "./base3D";
import { MeshLoader } from "./mesh.loader";

export class Luchador3D extends Base3D {
  private character: BABYLON.AbstractMesh;
  private base: BABYLON.Mesh;
  private turret: BABYLON.Mesh;
  public loader: Promise<any>;
  public id: number;

  constructor(
    id: number,
    name: string,
    scene: BABYLON.Scene,
    material: BABYLON.StandardMaterial,
    position: BABYLON.Vector3,
    vehicleRotationY: number,
    gunRotationY: number
  ) {
    super();

    this.id = id;

    this.mesh = BABYLON.Mesh.CreateBox(this.getName(), 1, scene);
    this.mesh.isVisible = false;
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
    this.mesh.scaling = new BABYLON.Vector3(1, 1, 1);

    this.turret = BABYLON.Mesh.CreateBox(this.getName() + ".turret", 1, scene);
    this.turret.parent = this.mesh;
    this.turret.isVisible = false;
    this.turret.rotation.y = gunRotationY;

    this.base = BABYLON.Mesh.CreateBox(this.getName() + ".base", 1, scene);
    this.base.parent = this.mesh;
    this.base.isVisible = false;
    this.base.rotation.y = vehicleRotationY;

    let self = this;

    let charLoader = MeshLoader.loadVisible(
      scene,
      "robolucha_char03.babylon",
      "robolucha_retopo"
    );

    let baseLoader = MeshLoader.loadVisible(
      scene,
      "vehicle_base_anim01.babylon",
      "vehicle_base"
    );

    let turretLoader = MeshLoader.loadVisible(
      scene,
      "vehicle_turret_anim01.babylon",
      "vehicle_turret"
    );

    this.loader = Promise.all([charLoader, baseLoader, turretLoader]);

    charLoader.then(mesh => {
      mesh.parent = self.turret;
      self.character = mesh;
      self.character.material = material;
      self.character.id = self.getName() + ".character";
    });

    baseLoader.then(mesh => {
      mesh.parent = self.base;
    });

    turretLoader.then(mesh => {
      mesh.parent = self.turret;
    });

    let labelColor = BABYLON.Color3.FromHexString("#DDDDDD");
    this.addLabel(name, -100, labelColor);
  }

  rotateVehicle(value: number) {
    this.base.rotation.y = value;
  }

  dispose() {
    this.character.dispose();
    this.base.dispose();
    this.turret.dispose();
    this.mesh.dispose();
    this.advancedTexture.dispose();
  }

  rotateGun(value: number) {
    this.turret.rotation.y = value;
  }

  getName(): string {
    return "luchador" + this.id;
  }
}
