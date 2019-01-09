import { SharedConstants } from "./shared.constants";
import * as BABYLON from "babylonjs";
import { Luchador } from "../watch-match/watch-match.model";

export class Luchador3D {
  getName(): string {
    return "luchador" + this.luchador.state.id;
  }

  // speed in units per second
  private speed: number = 5;
  private meshes: Array<BABYLON.AbstractMesh> = [];
  private parent: BABYLON.Mesh;
  private scene: BABYLON.Scene;
  private luchador: Luchador;

  constructor(
    luchador: Luchador,
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
    this.parent.rotation.y = vehicleRotationY;

    this.parent.scaling = new BABYLON.Vector3(1, 1, 1);
    let self = this;

    // luchador_test02.babylon
    // luchador.babylon
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

  move(x: number, z: number) {
    this.parent.position.x = this.parent.position.x + x;
    this.parent.position.z = this.parent.position.z + z;

    // this.animate(
    //   "position.x",
    //   this.parent.position.x,
    //   this.parent.position.x + value
    // );
  }

  rotateVehicle(value: number) {
    this.parent.rotation.y = this.parent.rotation.y + value;

    // this.animate(
    //   "rotation.y",
    //   this.parent.rotation.y,
    //   this.parent.rotation.y + value
    // );
  }

  rotateGun(value: number) {
    // TODO: implement this
  }

  private activeAnimations: Map<string, string> = new Map<string, string>();

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

    if (this.activeAnimations.has(attribute)) {
      // console.log("active animation in progress for ", attribute);
      return;
    }

    this.activeAnimations.set(attribute, attribute);

    const name = "animation-" + attribute;

    BABYLON.Vector3;
    let animationBox = new BABYLON.Animation(
      name,
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

    const animationSpeed = 1.0;

    animationBox.setKeys(keys);
    this.parent.animations = [];
    this.parent.animations.push(animationBox);
    this.scene.beginAnimation(
      this.parent,
      0,
      lastFrame,
      false,
      animationSpeed,
      () => {
        // when animation finished remove from the active list
        this.activeAnimations.delete(attribute);
      }
    );
  }

  fadeOut(speed: number = 2.5) {
    this.animate("visibility", 1, 0, speed);

    // will work with the meshes?
    // this.meshes.forEach(mesh => {
    //   this.animate(mesh, "visibility", 1, 0, speed);
    // });
  }
}
