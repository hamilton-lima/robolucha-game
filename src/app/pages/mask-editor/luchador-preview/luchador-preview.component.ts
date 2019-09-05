import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { TextureBuilder } from "../../../arena/texture-builder";
import { MaskEditorMediator } from "../mask-editor.mediator";
import { ModelGameComponent, ModelConfig } from "src/app/sdk";

@Component({
  selector: "app-luchador-preview",
  templateUrl: "./luchador-preview.component.html",
  styleUrls: ["./luchador-preview.component.css"]
})
export class LuchadorPreviewComponent implements OnInit, OnDestroy {
  @ViewChild("preview") canvas;
  // @ViewChild("debug") debug;
  @Input() luchadorSubject: BehaviorSubject<ModelGameComponent>;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;
  private character: BABYLON.AbstractMesh;

  material: BABYLON.StandardMaterial;
  dynamicTexture: BABYLON.DynamicTexture;
  context: CanvasRenderingContext2D;
  rotate: boolean = false;
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
    this.subscription = this.mediator.configs.subscribe(
      (configs: ModelConfig[]) => {
        if (self.character) {
          self.builder
            .loadDynamicTexture(configs, self.scene)
            .then(material => {
              self.character.material = material;
            });
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

  createScene(configs: ModelConfig[]): Promise<void> {
    const self = this;
    return new Promise(function(resolve, reject) {
      const lightPosition = new BABYLON.Vector3(0, 10, -10);
      const cameraPosition = new BABYLON.Vector3(2.0, 2.0, -2.5);
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
      self.camera.setTarget(BABYLON.Vector3.Zero());
      // // attach the camera to the canvas
      self.camera.attachControl(self.canvas.nativeElement, false);
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
        console.log("[Luchador Preview] imported meshes luchador", newMeshes);

        newMeshes.forEach(mesh => {
          console.log("[Luchador3D] mesh.name", mesh.name);
          if (mesh.name == "robolucha_retopo") {
            mesh.visibility = 0;
            self.character = mesh;
            self.character.position = BABYLON.Vector3.Zero();
            self.character.position.y = -2;
            self.character.rotation.z = 1;

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
      this.scene.render();
      if (this.character && this.rotate) {
        this.character.rotation.z += -0.03;
        console.log("rotation ", this.character.rotation.z);
      }
    });
  }

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }
}
