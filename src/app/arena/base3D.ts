import { SharedConstants } from "./shared.constants";
import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import { Luchador } from "../watch-match/watch-match.model";

export class Base3D {
  private activeAnimations: Map<string, string> = new Map<string, string>();

  // speed in units per second
  protected speed: any;
  protected mesh: BABYLON.Mesh;
  protected scene: BABYLON.Scene;
  protected advancedTexture: GUI.AdvancedDynamicTexture;
  protected label: GUI.TextBlock;

  constructor() {
  }

  animate(
    attribute: string,
    source: number,
    target: number,
    speed = this.speed,
    callback?: (mesh: BABYLON.Mesh) => void
  ) {

    if (source === target) {
      return;
    }

    if (this.activeAnimations.has(attribute)) {
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

  moveTo(x: number, z: number) {
    this.mesh.position.x = x;
    this.mesh.position.z = z;

    // this.animate(
    //   "position.x",
    //   this.parent.position.x,
    //   this.parent.position.x + value
    // );
  }

  dispose(): any {
    this.mesh.dispose();

    if( this.advancedTexture){
      this.advancedTexture.dispose();
    }

    // TODO: add Fadeout effect to remove elements from the scene
    // this.animate("visibility", 1, 0, this.speed, (mesh: BABYLON.Mesh) => {
    //   // console.log("trying to remove the bullet");
    // mesh.dispose();
    // });
  }

  initAdvancedTexture(){
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  }

  addLabel(
    text: string,
    linkOffsetY: number,
    baseOffsetX: number,
    textColor: BABYLON.Color3
  ) {

    if( ! this.advancedTexture){
      this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    }

    // var text1 = new BABYLON.GUI.TextBlock();
    // text1.text = text;
    // text1.color = "white";
    // text1.fontSize = 18;
    const width = (text.length * 10)+7;

    var rect1 = new GUI.Rectangle();
    rect1.width = width + "px";
    rect1.height = "20px";
    rect1.color = textColor.toHexString();
    rect1.thickness = 0;
    rect1.background = "black";
    rect1.alpha = 0.5;
    rect1.linkOffsetY = linkOffsetY;
    rect1.linkOffsetX = baseOffsetX + rect1.widthInPixels / 2;
    this.advancedTexture.addControl(rect1);

    this.label = new GUI.TextBlock();
    this.label.text = text;
    rect1.addControl(this.label);

    rect1.linkWithMesh(this.mesh);
  }

  getPosition(): BABYLON.Vector3 {
    return this.mesh.position;
  }

  getScene(): BABYLON.Scene {
    return this.scene;
  }

  setMaterial(material: BABYLON.Material) {
    this.mesh.material = material;
  }

  setLabel(label: string) {
    if (this.label) {
      this.label.text = label;
    }
  }
}
