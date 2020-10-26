import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import { Base3D } from "./base3D";
import { MeshLoader } from "./mesh.loader";
import { Helper3D } from "./helper3d";
import { AudioService, AudioType } from "../shared/audio.service";

export interface AnimationDefition {
  name: string;
  from: number;
  to: number;
}

export const characterAnimations: Array<AnimationDefition> = [
  { name: "idle", from: 0, to: 60 },
  { name: "run", from: 65, to: 125 },
  { name: "fire", from: 130, to: 145 },
  { name: "hit", from: 150, to: 165 },
  { name: "found", from: 170, to: 230 },
  { name: "celebrate", from: 235, to: 280 }
];

export const idlePosition = 0;

export class Luchador3D extends Base3D {
  private character: BABYLON.AbstractMesh;
  private base: BABYLON.Mesh;
  private turret: BABYLON.Mesh;
  public loader: Promise<any>;
  public id: number;
  public scene: BABYLON.Scene;

  private lifeBar: GUI.Rectangle;
  private lifeBarFill: GUI.Rectangle;
  private dividers: Array<GUI.Rectangle>;
  private healthText: GUI.TextBlock;
  private health: number;
  private showHealthNumber = false;

  private radarDisc: BABYLON.Mesh;
  private radarMaterial: BABYLON.StandardMaterial;

  private readonly OFFSET_X = -30;
  private readonly OFFSET_Y = -65;
  private readonly LABEL_OFFSET_Y = -85;

  private audio: AudioService;

  constructor(
    id: number,
    name: string,
    scene: BABYLON.Scene,
    material: Promise<BABYLON.StandardMaterial>,
    position: BABYLON.Vector3,
    vehicleRotationY: number,
    gunRotationY: number,
    radarAngle: number,
    radarRadius: number,
    audio: AudioService
    // shadowGenerator: BABYLON.ShadowGenerator
  ) {
    super();
    this.initAdvancedTexture();

    this.id = id;
    this.scene = scene;
    this.audio = audio;
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

    this.radarMaterial = new BABYLON.StandardMaterial(
      this.getName() + ".radarMaterial",
      scene
    );
    this.radarMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    this.radarMaterial.alpha = 0.5;

    this.radarDisc = BABYLON.MeshBuilder.CreateDisc(
      this.getName() + ".turret.radar",
      {
        radius: radarRadius,
        arc: radarAngle / 360,
        tessellation: 24,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      },
      scene
    );
    this.radarDisc.parent = this.turret;
    this.radarDisc.material = this.radarMaterial;
    this.radarDisc.position.y = 0.1;
    this.radarDisc.rotation.x = Helper3D.angle2radian(90);
    this.radarDisc.rotation.y = Helper3D.angle2radian(radarAngle / 2);
    // this.radarDisc.renderingGroupId = 1; //this is for testing and should be removed.

    this.lifeBar = new GUI.Rectangle(this.getName() + ".lifeBar");
    this.lifeBar.width = "50px";
    this.lifeBar.height = "15px";
    this.lifeBar.color = "green";
    this.lifeBar.thickness = 1;
    this.lifeBar.background = "black";
    this.lifeBar.alpha = 0.5;
    this.lifeBar.linkOffsetY = this.OFFSET_Y;
    this.lifeBar.linkOffsetX = this.OFFSET_X + this.lifeBar.widthInPixels / 2;
    this.advancedTexture.addControl(this.lifeBar);
    this.lifeBar.linkWithMesh(this.mesh);

    this.lifeBarFill = new GUI.Rectangle(this.getName() + ".lifeBarFill");
    this.lifeBarFill.horizontalAlignment =
      GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.lifeBarFill.width = "50px";
    this.lifeBarFill.height = "15px";
    this.lifeBarFill.color = "green";
    this.lifeBarFill.thickness = 0;
    this.lifeBarFill.background = "green";
    this.lifeBarFill.alpha = 0.5;
    this.lifeBarFill.linkOffsetY = this.OFFSET_Y;

    this.advancedTexture.addControl(this.lifeBarFill);
    this.lifeBarFill.linkWithMesh(this.mesh);

    for (let i = 0; i < 5; i++) {
      let divider = new GUI.Rectangle(this.getName() + ".dividers" + i);
      divider.width = "11px";
      divider.height = "15px";
      divider.color = "black";
      divider.thickness = 1;
      divider.alpha = 1;
      divider.linkOffsetY = this.OFFSET_Y;
      divider.linkOffsetX =
        this.OFFSET_X +
        this.lifeBar.widthInPixels / 2 -
        20 +
        i * 11 -
        i +
        "px"; /*(i*10) -17 -i + */
      this.advancedTexture.addControl(divider);
      divider.linkWithMesh(this.mesh);
    }

    this.health = 10;

    if (this.showHealthNumber) {
      this.healthText = new GUI.TextBlock();
      this.healthText.text = "10";
      this.healthText.color = "white";
      this.healthText.fontSize = 12;
      this.healthText.linkOffsetY = this.OFFSET_Y;
      this.advancedTexture.addControl(this.healthText);
      this.healthText.linkWithMesh(this.mesh);
    }

    let self = this;

    let charLoader = MeshLoader.loadVisible(
      scene,
      "luchador.babylon",
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
      // shadowGenerator.addShadowCaster(mesh, true);
      self.character.id = self.getName() + ".character";
      material.then(result => (self.character.material = result));

      self.createIdle();
    });

    baseLoader.then(mesh => {
      mesh.parent = self.base;
    });

    turretLoader.then(mesh => {
      mesh.parent = self.turret;
    });

    let labelColor = BABYLON.Color3.FromHexString("#DDDDDD");
    this.addLabel(name, this.LABEL_OFFSET_Y, this.OFFSET_X, labelColor);
    this.audio.move(this.mesh, this.scene);
  }

  idle: BABYLON.Animatable;

  createIdle() {
    this.idle = this.scene.beginWeightedAnimation(
      this.character.skeleton,
      0,
      60,
      1,
      true
    );
  }

  fire() {
    this.animateFrom("fire");
    this.audio.fire(this.mesh, this.scene);
  }

  hit() {
    this.animateFrom("hit");
    this.audio.hit(this.mesh, this.scene);
  }

  animateFound() {
    this.animateFrom("found");
  }

  animateFrom(name: string) {
    if (this.character && this.character.skeleton) {
      const animation = characterAnimations.filter(animation => {
        return animation.name == name;
      })[0];

      this.scene.beginWeightedAnimation(
        this.character.skeleton,
        animation.from,
        animation.to,
        1,
        false
      );
    }
  }

  rotateVehicle(value: number) {
    this.base.rotation.y = value;
  }

  dispose() {
    if (this.character) {
      this.character.dispose();
    }

    if (this.base) {
      this.base.dispose();
    }

    if (this.turret) {
      this.turret.dispose();
    }

    if (this.mesh) {
      this.mesh.dispose();
    }

    if (this.advancedTexture) {
      this.advancedTexture.dispose();
    }
  }

  rotateGun(value: number) {
    this.turret.rotation.y = value;
  }

  getName(): string {
    return "luchador" + this.id;
  }

  getHealth() {
    return this.health;
  }

  setHealth(value: number) {
    this.health = value;

    if (this.showHealthNumber) {
      this.healthText.text = this.health + "";
    }

    //TODO: Get MaxHealth instead of hardcoding 20
    const percentage = this.health / 20;
    let fillW = 50 * percentage;

    this.lifeBarFill.width = fillW + "px";
    this.lifeBarFill.linkOffsetX =
      -30 +
      this.lifeBar.widthInPixels / 2 +
      ((50 - fillW) / 2 - (50 - fillW)) +
      "px";

      this.lifeBarFill.color = this.getLifeBarColor(percentage);
      this.lifeBarFill.background = this.getLifeBarColor(percentage);
  }

  getLifeBarColor(value){
    if( value <= 0.2){
      return "red";
    }

    if( value <= 0.5){
      return "yellow";
    }

    return "green";
  }

  getTurret(){
    return this.turret;
  }

}
