import { Component, OnInit, ViewChild, Input } from "@angular/core";
import {
  GameDefinition,
  MatchState,
  Bullet,
  Luchador
} from "../watch-match/watch-match.model";
import { Subject, concat, forkJoin } from "rxjs";
import { Luchador3D } from "../arena/luchador3d";
import { Bullet3D } from "../arena/bullet3d";
import { Scene3D } from "../arena/scene3d";
import { Helper3D } from "../arena/helper3d";
import { Box3D } from "../arena/box3d";
import { CONTEXT } from "@angular/core/src/render3/interfaces/view";

@Component({
  selector: "app-luchador-preview",
  templateUrl: "./luchador-preview.component.html",
  styleUrls: ["./luchador-preview.component.css"]
})
export class LuchadorPreviewComponent implements OnInit {
  @ViewChild("preview") canvas;
  @ViewChild("debug") debugCanvas;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;
  ground: BABYLON.Mesh;
  scene3D: Scene3D;
  private character: BABYLON.AbstractMesh;

  TEXTURE_WIDTH = 512;
  TEXTURE_HEIGHT = 512;
  material: BABYLON.StandardMaterial;
  dynamicTexture: BABYLON.DynamicTexture;
  context: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit() {
    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);
    this.createScene();
    this.render();
  }

  createScene(): void {
    const lightPosition = new BABYLON.Vector3(0, 10, -10);
    const cameraPosition = new BABYLON.Vector3(2.5, 2.5, -2.5);
    this.scene = new BABYLON.Scene(this.engine);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new BABYLON.HemisphericLight(
      "light1",
      lightPosition,
      this.scene
    );
    this.light.intensity = 0.9;

    // this.createGround();
    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    this.camera = new BABYLON.FreeCamera("camera1", cameraPosition, this.scene);
    this.camera.rotation.x = this.angle2radian(45);
    // // target the camera to scene origin
    this.camera.setTarget(BABYLON.Vector3.Zero());
    // // attach the camera to the canvas
    this.camera.attachControl(this.canvas.nativeElement, false);
    this.loadModel();
  }

  loadModel() {
    const self = this;

    BABYLON.SceneLoader.ImportMesh(
      "",
      "assets/",
      "robolucha_char03.babylon",
      this.scene,
      function(newMeshes, particleSystems) {
        console.log("[Luchador Preview] imported meshes luchador", newMeshes);

        newMeshes.forEach(mesh => {
          console.log("[Luchador3D] mesh.name", mesh.name);
          if (mesh.name == "robolucha_retopo") {
            mesh.visibility = 0;
            self.character = mesh;
            self.character.position = BABYLON.Vector3.Zero();
            self.character.position.y = -2;
            self.loadDynamicTexture();
          }
        });
      }
    );
  }

  loadDynamicTexture() {
    this.dynamicTexture = new BABYLON.DynamicTexture(
      "luchador-preview-dynamic-texture",
      this.TEXTURE_WIDTH,
      this.scene,
      true
    );
    this.context = this.dynamicTexture.getContext();
    console.log("dynamic texture width", this.dynamicTexture.getSize());

    this.material = new BABYLON.StandardMaterial(
      "luchador-preview-material",
      this.scene
    );
    console.log(">> material", this.character.material);

    this.character.material = this.material;
    this.character.visibility = 1;

    this.material.diffuseTexture = this.dynamicTexture;
    this.material.specularColor = new BABYLON.Color3(0, 0, 0);
    this.material.ambientColor = new BABYLON.Color3(0.588, 0.588, 0.588);
    this.material.backFaceCulling = false;

    let sequence = forkJoin([
      this.loadImage("back.png"),
      this.loadImage("face.png")
    ]);

    const self = this;
    sequence.subscribe(images => {
      console.log("all images loaded", images);

      // temporary canvas
      var inMemoryCanvas = document.createElement("canvas");
      inMemoryCanvas.width = self.TEXTURE_WIDTH;
      inMemoryCanvas.height = self.TEXTURE_HEIGHT;

      let context = inMemoryCanvas.getContext("2d");
      context.imageSmoothingEnabled = true;

      // draw skin
      context.fillStyle = "#0000DD";
      context.fillRect(0, 0, this.TEXTURE_WIDTH, this.TEXTURE_HEIGHT);
      context.fill();

      context.fillStyle = "#00DD00";
      context.fillRect(0, 0, 50, 50);
      context.fill();

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 150, 50, 50);
      context.fill();

      // draw layers
      images.forEach(image => {
        context.drawImage(image, 0, 0);
      });

      self.context.drawImage(inMemoryCanvas, 0, 0);
      self.dynamicTexture.update();

      const debugCtx = (<HTMLCanvasElement>(
        this.debugCanvas.nativeElement
      )).getContext("2d");
      debugCtx.drawImage(inMemoryCanvas, 0, 0);
    });
  }

  loadImage(name): Subject<HTMLImageElement> {
    let result = new Subject<HTMLImageElement>();
    let img = new Image();
    img.src = "assets/dynamic-texture/" + name;
    img.onload = () => {
      result.next(img);
      result.complete();
    };
    return result;
  }

  render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
      if (this.character) {
        this.character.rotation.z += -0.03;
      }
    });
  }

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }
}
