import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import {
  GameDefinition,
  MatchState,
  Bullet,
  Luchador
} from "../watch-match/watch-match.model";
import { Subject, concat, forkJoin, BehaviorSubject, Subscription } from "rxjs";
import { Luchador3D } from "../arena/luchador3d";
import { Bullet3D } from "../arena/bullet3d";
import { Scene3D } from "../arena/scene3d";
import { Helper3D } from "../arena/helper3d";
import { Box3D } from "../arena/box3d";
import { CONTEXT } from "@angular/core/src/render3/interfaces/view";
import { MainLuchador } from "../sdk";
import { TextureBuilder } from "./texture-builder";
import { MaskEditorMediator } from "../mask-editor/mask-editor.mediator";
import {
  maskEditorCategories,
  CategoryOptions,
  EditorType
} from "../mask-editor/mask-editor-category.model";
import { LuchadorConfigService } from "../mask-editor-detail/luchador-config.service";

@Component({
  selector: "app-luchador-preview",
  templateUrl: "./luchador-preview.component.html",
  styleUrls: ["./luchador-preview.component.css"]
})
export class LuchadorPreviewComponent implements OnInit, OnDestroy {
  @ViewChild("preview") canvas;
  @ViewChild("debug") debug;
  @Input() luchadorSubject: BehaviorSubject<MainLuchador>;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;
  private character: BABYLON.AbstractMesh;

  TEXTURE_WIDTH = 512;
  TEXTURE_HEIGHT = 512;
  material: BABYLON.StandardMaterial;
  dynamicTexture: BABYLON.DynamicTexture;
  context: CanvasRenderingContext2D;
  rotate: boolean = false;
  luchador: MainLuchador;
  subscription: Subscription;
  loadingTexture = false;
  current: Promise<void>;

  constructor(
    private builder: TextureBuilder,
    private mediator: MaskEditorMediator,
    private luchadorConfigs: LuchadorConfigService
  ) {}

  ngOnInit() {
    const self = this;

    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);
    // TODO: control active promise
    this.current = this.createScene();
    this.current.then(() => {
      this.render();

      this.subscription = this.mediator.luchador.subscribe(
        (luchador: MainLuchador) => {
          self.luchador = luchador;

          // TODO: control active promise
          new Promise(function(resolve, reject) {
            self.loadDynamicTexture(self, resolve, reject);
          });

          console.log("luchador preview", self.luchador);
        }
      );
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createScene(): Promise<void> {
    const self = this;
    return new Promise(function(resolve, reject) {
      const lightPosition = new BABYLON.Vector3(0, 10, -10);
      const cameraPosition = new BABYLON.Vector3(2.5, 2.5, -2.5);
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
      self.loadModel(self, resolve, reject);
    });
  }

  loadModel(self, resolve, reject) {
    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "robolucha_char03.babylon",
      self.scene,
      function(newMeshes, particleSystems) {
        console.log("[Luchador Preview] imported meshes luchador", newMeshes);

        newMeshes.forEach(mesh => {
          console.log("[Luchador3D] mesh.name", mesh.name);
          if (mesh.name == "robolucha_retopo") {
            mesh.visibility = 0;
            self.character = mesh;
            self.character.position = BABYLON.Vector3.Zero();
            self.character.position.y = -2;
            self.loadDynamicTexture(self, resolve, reject);
          }
        });
      }
    );
  }

  loadDynamicTexture(self, resolve, reject) {
    if (self.loadingTexture) {
      return;
    }
    self.loadingTexture = true;
    self.dynamicTexture = new BABYLON.DynamicTexture(
      "luchador-preview-dynamic-texture",
      self.TEXTURE_WIDTH,
      self.scene,
      true
    );
    self.context = self.dynamicTexture.getContext();
    self.dynamicTexture.wrapR = 1;
    self.dynamicTexture.wrapU = 1;
    self.dynamicTexture.wrapV = 1;

    self.material = new BABYLON.StandardMaterial(
      "luchador-preview-material",
      self.scene
    );

    self.character.material = self.material;
    self.character.visibility = 1;

    self.material.diffuseTexture = self.dynamicTexture;
    self.material.specularColor = new BABYLON.Color3(0, 0, 0);
    self.material.ambientColor = new BABYLON.Color3(0.588, 0.588, 0.588);

    let images2Load = [
      self.loadImage("back"),
      self.loadImage("face"),
      self.loadImage("wrist"),
      self.loadImage("ankle"),
      self.loadImage("feet")
    ];

    self.addImagesFromShapes(self.luchador, images2Load, maskEditorCategories);

    let sequence = forkJoin(images2Load);

    sequence.subscribe((images: Array<HTMLImageElement>) => {
      console.log("all images loaded", images.map(image => image.name));

      if (self.luchador) {
        self.builder
          .build(self.luchador, images, self.TEXTURE_WIDTH, self.TEXTURE_HEIGHT)
          .then(canvas => {
            self.debug.nativeElement.getContext("2d").drawImage(canvas, 0, 0);
            self.context.drawImage(canvas, 0, 0);
            self.dynamicTexture.update();
          });
      }

      self.loadingTexture = false;
      resolve();
    });
  }

  /** Finds all shape image names and create the Loader for each one */
  addImagesFromShapes(
    luchador: MainLuchador,
    images2Load: Array<Subject<HTMLImageElement>>,
    categories: Array<CategoryOptions>
  ) {
    if (!luchador) {
      return;
    }

    categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (subcategory.type == EditorType.shape) {
          const fileName = this.luchadorConfigs.getShapeNoDefaultValue(
            luchador,
            subcategory.key
          );

          if (fileName) {
            images2Load.push(
              this.loadImageFromFileName(fileName, subcategory.key)
            );
          } 
        }
      });
    });
  }

  loadImage(name): Subject<HTMLImageElement> {
    const fileName = "assets/shapes/" + name + ".png";
    return this.loadImageFromFileName(fileName, name);
  }

  loadImageFromFileName(fileName, name): Subject<HTMLImageElement> {
    let result = new Subject<HTMLImageElement>();
    let img = new Image();
    img.name = name;

    img.src = fileName;
    img.onload = () => {
      result.next(img);
      result.complete();
    };
    return result;
  }

  render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
      if (this.character && this.rotate) {
        this.character.rotation.z += -0.03;
      }
    });
  }

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }
}
