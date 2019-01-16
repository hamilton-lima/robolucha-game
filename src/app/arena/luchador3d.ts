import { SharedConstants } from "./shared.constants";
import * as BABYLON from "babylonjs";
import { Luchador } from "../watch-match/watch-match.model";
import { Base3D } from "./base3D";

export class Luchador3D extends Base3D {
  getName(): string {
    return "luchador" + this.luchador.state.id;
  }

  private meshes: Array<BABYLON.AbstractMesh> = [];
  private base: Array<BABYLON.AbstractMesh> = [];
  private turret: Array<BABYLON.AbstractMesh> = [];

  private parent: BABYLON.Mesh;
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

    this.mesh = BABYLON.Mesh.CreateBox("parent", 1, scene);
    this.mesh.isVisible = false;
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
    // TODO: add vehicle
    this.mesh.rotation.y = vehicleRotationY;

    this.mesh.scaling = new BABYLON.Vector3(1, 1, 1);
    let self = this;

    // luchador_test02.babylon
    // luchador.babylon
    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "robolucha_char03.babylon",
      scene,
      function(newMeshes, particleSystems) {
        console.log("[Luchador3D] imported meshes luchador", newMeshes);
        self.meshes = newMeshes;

        newMeshes.forEach(mesh => {
          mesh.parent = self.mesh;
          // mesh.position.y = 1.0;
          // mesh.rotation.z = - Math.PI / 2;
        });

      }
    );

    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "robolucha_vehicle_base02.babylon",
      scene,
      function(newMeshes, particleSystems) {
        console.log("[Luchador3D] imported meshes base", newMeshes);
        self.base = newMeshes;

        newMeshes.forEach(mesh => {
          mesh.parent = self.mesh;
          mesh.material = material;
        });
      }
    );

    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "robolucha_vehicle_turret02.babylon",
      scene,
      function(newMeshes, particleSystems) {
        console.log("[Luchador3D] imported meshes turret", newMeshes);
        self.turret = newMeshes;

        newMeshes.forEach(mesh => {
          mesh.parent = self.mesh;
          mesh.material = material;
          // TODO: Remove this
          // mesh.rotation.x = - Math.PI / 2;
        });
      }
    );

    let green = BABYLON.Color3.FromHexString("#00FF00");
    this.addLabel(luchador.state.name, -120, green);
  }

  rotateVehicle(value: number) {
    this.mesh.rotation.y = value;

    // this.animate(
    //   "rotation.y",
    //   this.parent.rotation.y,
    //   this.parent.rotation.y + value
    // );
  }

  rotateGun(value: number) {
    // TODO: implement this
  }

}
