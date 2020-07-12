import { Component, OnInit, ViewChild, Input, OnDestroy, HostListener } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { TextureBuilder } from "../../../arena/texture-builder";
import { MaskEditorMediator, FeatureChange } from "../mask-editor.mediator";
import { ModelGameComponent, ModelConfig } from "src/app/sdk";
import { Vector3  } from "babylonjs";

export interface ICameraConfiguration{
  position : BABYLON.Vector3;
  target : BABYLON.Vector3;
}

@Component({
  selector: "app-luchador-preview",
  templateUrl: "./luchador-preview.component.html",
  styleUrls: ["./luchador-preview.component.css"]
})
export class LuchadorPreviewComponent implements OnInit, OnDestroy {

  @ViewChild("preview") canvas;
  @Input() luchadorSubject: BehaviorSubject<ModelGameComponent>;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;
  private character: BABYLON.AbstractMesh;

  readonly ROTATION_SPEED = 0.5;

  material: BABYLON.StandardMaterial;
  dynamicTexture: BABYLON.DynamicTexture;
  context: CanvasRenderingContext2D;
  luchador: ModelGameComponent;
  subscription: Subscription;
  loadingTexture = false;
  current: Promise<void>;

  constructor(
    private builder: TextureBuilder,
    private mediator: MaskEditorMediator
  ) {}

  ngOnInit() {
    const self = this;
    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);
    this.destPos = this.mapCamera.get(FeatureChange.Default).position;
    this.destTarg = this.mapCamera.get(FeatureChange.Default).target;
    this.subscription = this.mediator.configs.subscribe(
      (configs: ModelConfig[]) => {
        if (self.character) {
          self.builder
            .loadDynamicTexture(configs, self.scene)
            .then(material => {
              self.character.material = material;
            });
            this.cameraConfig(this.mediator.featuresChanges);
        } else {
          this.current = this.createScene(configs).then(() => {
            this.render();
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cameraDefault : ICameraConfiguration = {position: new Vector3(0, 1, -2.3), target: new Vector3(0,0.1,0)};
  cameraHead : ICameraConfiguration = {position: new Vector3(0, 0.5, -1.5), target: new Vector3(0,0.3,0)};
  cameraBody : ICameraConfiguration = {position: new Vector3(0, -0.5, -1.5), target: new Vector3(0,-0.7,0)};
  // bodyParts cameraPosition cameraTarget
  mapCamera:Map<string, ICameraConfiguration> = 
    new Map([
        [FeatureChange.Default, this.cameraDefault],
        [FeatureChange.Head, this.cameraHead],
        [FeatureChange.Body, this.cameraBody]
    ]);

  cameraConfig(featuresChanges : string){
      this.destPos = this.mapCamera.get(featuresChanges).position;
      this.destTarg = this.mapCamera.get(featuresChanges).target;
  }

  createScene(configs: ModelConfig[]): Promise<void> {
    const self = this;
    console.log("criou a cena");
    return new Promise(function(resolve, reject) {
      const lightPosition = new BABYLON.Vector3(0, 10, -10);
      const cameraPosition = self.destPos;
      self.scene = new BABYLON.Scene(self.engine);
      
      // create a basic light, aiming 0,1,0 - meaning, to the sky
      self.light = new BABYLON.HemisphericLight(
        "light1",
        lightPosition,
        self.scene
      );
      self.light.intensity = 0.9;

      // self.createGround();
      // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
      self.camera = new BABYLON.FreeCamera(
        "camera1",
        cameraPosition,
        self.scene
      );
      self.camera.rotation.x = self.angle2radian(45);
      // // target the camera to scene origin
      self.camera.setTarget(self.destTarg);
      // // attach the camera to the canvas
      // self.camera.attachControl(self.canvas.nativeElement, false);
      self.loadModel(self, configs, resolve);
    });
  }

  loadModel(self, configs: ModelConfig[], resolve) {
    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "robolucha_char03.babylon",
      self.scene,
      function(newMeshes) {

        newMeshes.forEach(mesh => {
          if (mesh.name == "robolucha_retopo") {
            mesh.visibility = 0;
            self.character = mesh;
            self.character.position = BABYLON.Vector3.Zero();
            self.character.position.y = -2.3;
            self.character.rotation.z = 1.6;

            let material = new BABYLON.StandardMaterial("material", self.scene);
            material.diffuseColor = BABYLON.Color3.FromHexString("#FAA21D");
            self.character.material = material;

            self.builder
              .loadDynamicTexture(configs, self.scene)
              .then(material => {
                self.character.material = material;
                mesh.visibility = 1;
                resolve();
              });
          }
        });
      }
    );
  }

  render(): void {
    this.engine.runRenderLoop(() => {
      this.interpolate();
      this.scene.render();
    });
  }

  destPos : BABYLON.Vector3;
  destTarg : BABYLON.Vector3;
  interpolate(){
    this.camera.position = BABYLON.Vector3.Lerp(this.camera.position,this.destPos,0.05);
    this.camera.setTarget(BABYLON.Vector3.Lerp(this.camera.getTarget(),this.destTarg,0.05));
  }

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }

  sliderValue = 0;
  rotate(value : any){
    if(!this.character)
      return;

    if(value > this.sliderValue){
       this.character.rotation.z += this.ROTATION_SPEED;
     }
    else if(value < this.sliderValue){
      this.character.rotation.z -= this.ROTATION_SPEED;
    }
    this.sliderValue = value;
  }
}
