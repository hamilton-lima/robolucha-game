import { Component, OnInit, ViewChild } from "@angular/core";
import { Luchador3D } from "../arena/luchador3d";
import { TextureBuilder } from "../luchador-preview/texture-builder";
import { Vector3 } from "babylonjs";
import {
  Luchador,
  LuchadorState,
  Mask
} from "../watch-match/watch-match.model";
import { MainLuchador } from "../sdk";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-luchador-preview-new",
  templateUrl: "./luchador-preview-new.component.html",
  styleUrls: ["./luchador-preview-new.component.css"]
})
export class LuchadorPreviewNewComponent implements OnInit {
  @ViewChild("preview2") canvas;

  
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.PointLight;
  private luchador3d: Luchador3D;
  private luchador: MainLuchador;
  constructor(private builder: TextureBuilder, private route: ActivatedRoute) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    const self = this;
    this.luchador = data.luchador;
    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);
    this.createScene();
    this.builder.loadDynamicLuchadorTexture(self.luchador3d, self.luchador, ()=>{}, ()=>{});
  }

  createScene(): void {
    this.scene = new BABYLON.Scene(this.engine);
    this.camera = new BABYLON.FreeCamera("camera", new Vector3(0, 2, -6), this.scene);
    this.camera.attachControl(this.canvas.nativeElement, false);
    this.light = new BABYLON.PointLight('light', this.camera.position, this.scene);

    this.luchador3d = new Luchador3D(
      this.dummyLuchador(),
      this.scene,
      new Vector3(0, 0, 0),
      1,
      1
    );
    this.render();
  }
  render(): void {
    // run the render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
  dummyLuchador(): Luchador {
    return { state: this.dummyState(), name: "", mask: this.dummyMask() };
  }

  dummyState(): LuchadorState {
    return {
      id: 0,
      name: "",
      x: 0,
      y: 0,
      life: 0,
      angle: 0,
      gunAngle: 0,
      fireCoolDown: 0,
      headColor: "#888888",
      bodyColor: "#888888",
      k: 0,
      d: 0,
      score: 0
    };
  }

  dummyMask(): Mask {
    return {
      background: "none",
      backgroundColor: "#000000",
      background2: "none",
      background2Color: "#888888",
      ornamentTop: "none",
      ornamentTopColor: "#FFFFFF",
      ornamentBottom: "none",
      ornamentBottomColor: "#FF0000",
      face: "none",
      faceColor: "#00FF00",
      mouth: "none",
      mouthColor: "#0000FF",
      eye: "none",
      eyeColor: "#FF00FF"
    };
  }
}
