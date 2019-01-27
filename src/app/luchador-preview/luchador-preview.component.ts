import { Component, OnInit, ViewChild, Input } from "@angular/core";
import {
  GameDefinition,
  MatchState,
  Bullet,
  Luchador
} from "../watch-match/watch-match.model";
import { Subject } from "rxjs";
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
      { width: this.TEXTURE_WIDTH, height: this.TEXTURE_HEIGHT },
      this.scene,
      false
    );

    this.material = new BABYLON.StandardMaterial("luchador-preview-material", this.scene);                    
    this.material.diffuseTexture = this.dynamicTexture;
    let context = this.dynamicTexture.getContext();
    context.fillStyle = "#3366FF";
    context.fillRect(0,0,this.TEXTURE_WIDTH, this.TEXTURE_HEIGHT);

    this.character.material = this.material;
    this.dynamicTexture.update();

    // this.character.visibility = 1;
  }

  render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }
}
