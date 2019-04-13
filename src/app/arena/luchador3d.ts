import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import { Base3D } from "./base3D";
import { MeshLoader } from "./mesh.loader";

export class Luchador3D extends Base3D {
  private character: BABYLON.AbstractMesh;
  private base: BABYLON.Mesh;
  private turret: BABYLON.Mesh;
  public loader: Promise<any>;
  public id: number;
  private lifeBar: GUI.Rectangle;
  private lifeBarFill: GUI.Rectangle;
  private healthText: GUI.TextBlock;
  private health: number;


  constructor(
    id: number,
    name: string,
    scene: BABYLON.Scene,
    material: Promise<BABYLON.StandardMaterial>,
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

    this.lifeBar = new GUI.Rectangle(this.getName()+".lifeBar");
    this.lifeBar.width = "50px";
    this.lifeBar.height = "15px";
    this.lifeBar.color = "red"
    this.lifeBar.thickness = 1;
    this.lifeBar.background = "black";
    this.lifeBar.alpha = 0.5;
    this.lifeBar.linkOffsetY = -80;
    this.advancedTexture.addControl(this.lifeBar);
    this.lifeBar.linkWithMesh(this.mesh);

    this.lifeBarFill = new GUI.Rectangle(this.getName()+".lifeBarFill");
    this.lifeBarFill.width = "50px";
    this.lifeBarFill.height = "15px";
    this.lifeBarFill.color = "red";
    this.lifeBarFill.thickness = 0;
    this.lifeBarFill.background = "red";
    this.lifeBarFill.alpha = 0.5;
    this.lifeBarFill.linkOffsetY = -80;
    this.advancedTexture.addControl(this.lifeBarFill);
    this.lifeBarFill.linkWithMesh(this.mesh);

    this.health = 10;
    this.healthText = new GUI.TextBlock();
    this.healthText.text = "10";
    this.healthText.color = "white";
    this.healthText.fontSize = 12;
    this.healthText.linkOffsetY = - 79;
    this.advancedTexture.addControl(this.healthText);
    this.healthText.linkWithMesh(this.mesh);

   
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
      self.character.id = self.getName() + ".character";
      material.then( result => self.character.material = result );
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

  setHealth(value: number){
    this.health = value;
    this.healthText.text = this.health+"";
    // this.lifeBarFill.linkOffsetX = - (this.health)+"px";
    let fillW = (50 * (this.health/20))
 
    this.lifeBarFill.width = fillW +"px"; //TODO: Get MaxHealth instead of hardcoding 20
    this.lifeBar.linkOffsetX = (50 - fillW)/2 + "px"; 
    // this.lifeBarFill.linkOffsetX = -12.5;
    
  }
  
}
