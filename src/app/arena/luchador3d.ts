import { SharedConstants } from "./shared.constants";
import * as BABYLON from "babylonjs";
import { Luchador } from "../watch-match/watch-match.model";
import { Base3D } from "./base3D";
import { MeshLoader } from "./mesh.loader";

export class Luchador3D extends Base3D {
  getName(): string {
    return "luchador" + this.luchador.state.id;
  }

  private character: BABYLON.AbstractMesh;
  private base: BABYLON.Mesh;
  private turret: BABYLON.Mesh;

  private luchador: Luchador;

  constructor(
    luchador: Luchador,
    scene: BABYLON.Scene,
    position: BABYLON.Vector3,
    vehicleRotationY: number,
    gunRotationY: number
  ) {
    super();

    this.scene = scene;
    this.luchador = luchador;

    let material = new BABYLON.StandardMaterial("material", scene);
    material.diffuseColor = BABYLON.Color3.FromHexString("#FAA21D");

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

    let charLoader = MeshLoader.loadVisible(scene, 'robolucha_char03.babylon', 'robolucha_retopo');
    let baseLoader = MeshLoader.loadVisible(scene, 'vehicle_base_anim01.babylon', 'vehicle_base');
    let turretLoader = MeshLoader.loadVisible(scene, 'vehicle_turret_anim01.babylon', 'vehicle_turret');

    charLoader.then(mesh => {
      mesh.parent = self.turret;
      self.character = mesh;
      self.character.id = self.getName() + ".character";
    })

    baseLoader.then(mesh => {
      mesh.parent = self.base;
    });

    turretLoader.then(mesh => {
      mesh.parent = self.turret;
    });


    let labelColor = BABYLON.Color3.FromHexString("#DDDDDD");
    this.addLabel(luchador.state.name, -100, labelColor);
  }

  rotateVehicle(value: number) {
    this.base.rotation.y = value;
  }

  rotateGun(value: number) {
    this.turret.rotation.y = value;
  }
}
