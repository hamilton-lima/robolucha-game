import { SharedConstants } from "./shared.constants";
import * as BABYLON from "babylonjs";
import { Luchador } from "../watch-match/watch-match.model";

export class Base3D {
  private activeAnimations: Map<string, string> = new Map<string, string>();

  // speed in units per second
  protected speed: any;
  protected mesh: BABYLON.Mesh;
  protected scene: BABYLON.Scene;

  animate(
    attribute: string,
    source: number,
    target: number,
    speed = this.speed,
    callback?: (mesh: BABYLON.Mesh) => void
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
    this.mesh.animations = [];
    this.mesh.animations.push(animationBox);
    this.scene.beginAnimation(
      this.mesh,
      0,
      lastFrame,
      false,
      animationSpeed,
      () => {
        // when animation finished remove from the active list
        this.activeAnimations.delete(attribute);
        if (callback) {
          callback(this.mesh);
        }
      }
    );
  }

  move(x: number, z: number) {
    this.mesh.position.x = this.mesh.position.x + x;
    this.mesh.position.z = this.mesh.position.z + z;

    // this.animate(
    //   "position.x",
    //   this.parent.position.x,
    //   this.parent.position.x + value
    // );
  }

  dispose(): any {
    this.mesh.dispose();
    // TODO: add Fadeout effect to remove elements from the scene
    // this.animate("visibility", 1, 0, this.speed, (mesh: BABYLON.Mesh) => {
    //   console.log("trying to remove the bullet");
    // mesh.dispose();
    // });
  }
}
