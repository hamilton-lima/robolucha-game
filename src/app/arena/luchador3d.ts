import { SharedConstants } from "./shared.constants";
import * as BABYLON from "babylonjs";
import { MainLuchador } from "../sdk/model/models";

export class Luchador3D {
  getName(): string {
    return "box" + this.luchador.id;
  }

  // speed in units per second
  private speed: number = 5;
  private meshes: Array<BABYLON.AbstractMesh> = [];
  private parent: BABYLON.Mesh;
  private scene: BABYLON.Scene;
  private luchador: MainLuchador;

  constructor(
    luchador: MainLuchador,
    scene: BABYLON.Scene,
    position: BABYLON.Vector3,
    vehicleRotationY: number,
    gunRotationY: number
  ) {
    this.luchador = luchador;
    let material = new BABYLON.StandardMaterial("material", scene);
    material.diffuseColor = BABYLON.Color3.FromHexString("#FAA21D");

    this.parent = BABYLON.Mesh.CreateBox("parent", 1, scene);
    this.parent.isVisible = false;
    this.parent.position.x = position.x;
    this.parent.position.y = position.y;
    this.parent.position.z = position.z;
    // TODO: add vehicle
    this.parent.rotation.y = gunRotationY;

    this.parent.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
    let self = this;

    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "luchador.babylon",
      scene,
      function(newMeshes, particleSystems) {
        console.log("[Luchador3D] imported meshes", newMeshes);
        self.meshes = newMeshes;

        newMeshes.forEach(mesh => {
          mesh.parent = self.parent;
          // mesh.material = material;
        });
      }
    );

    this.scene = scene;
  }

  moveX(value: number) {
    this.animate("position.x", this.parent.position.x, value);
  }

  // moveY(value: number) {
  //   this.animate(
  //     "position.y",
  //     this.parent.position.y,
  //     this.parent.position.y + value
  //   );
  // }

  moveZ(value: number) {
    this.animate("position.z", this.parent.position.z, value);
  }

  rotateVehicle(value: number) {
    this.animate("rotation.y", this.parent.rotation.y, value);
  }

  rotateGun(value: number) {
    // TODO: implement this
  }

  animate(
    attribute: string,
    source: number,
    target: number,
    speed = this.speed
  ) {
    // console.log("animate", this.luchador.name, attribute, source, target);

    if (source === target) {
      // console.log("animation values are the same skipping");
      return;
    }

    BABYLON.Vector3;
    let animationBox = new BABYLON.Animation(
      "movex",
      attribute,
      SharedConstants.FPS,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    let amount = Math.abs(target - source);
    let lastFrame = (amount / speed) * SharedConstants.FPS;

    var keys = [
      { frame: 0, value: source },
      { frame: lastFrame, value: target }
    ];

    animationBox.setKeys(keys);
    this.parent.animations = [];
    this.parent.animations.push(animationBox);
    this.scene.beginAnimation(this.parent, 0, lastFrame, false);
  }

  fadeOut(speed: number = 2.5) {
    this.animate("visibility", 1, 0, speed);

    // will work with the meshes?
    // this.meshes.forEach(mesh => {
    //   this.animate(mesh, "visibility", 1, 0, speed);
    // });
  }
}
