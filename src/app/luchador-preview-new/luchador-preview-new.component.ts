import { Component, OnInit, ViewChild } from "@angular/core";
import { Luchador3D } from "../arena/luchador3d";
import { TextureBuilder } from "../arena/texture-builder";
import { Vector3 } from "babylonjs";
import {
  Luchador,
  LuchadorState,
  Mask
} from "../watch-match/watch-match.model";
import { MainLuchador } from "../sdk";
import { ActivatedRoute } from "@angular/router";
import { MaskEditorMediator } from "../mask-editor/mask-editor.mediator";
import { Subscription } from "rxjs";
import { t } from "@angular/core/src/render3";

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

  private current: Promise<void>;
  private subscription: Subscription;


  constructor(private builder: TextureBuilder, 
    private route: ActivatedRoute, 
    private mediator: MaskEditorMediator) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    const self = this;
    this.luchador = data.luchador;
    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);
    this.current = this.createScene();
    this.current.then(() => {
      this.render();      

      this.subscription = this.mediator.luchador.subscribe(
        (luchador: MainLuchador) => {
          self.luchador = luchador;
  
          new Promise(function(resolve, reject) {
            self.builder.loadDynamicLuchadorTexture(self.luchador3d, luchador, resolve, reject);
            self.loadModel(self, resolve, reject);
          });
        });
    });
    
    // this.builder.loadDynamicLuchadorTexture(self.luchador3d, self.luchador, ()=>{}, ()=>{});
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  createScene(): Promise<void> {
    const self = this;
    console.log("Create Scene Start")
    
    return new Promise(function(resolve, reject) {
      console.log("Create Scene Promise Start");
      self.scene = new BABYLON.Scene(self.engine);
      self.camera = new BABYLON.FreeCamera("camera", new Vector3(0, 2, -6), self.scene);
      self.camera.attachControl(self.canvas.nativeElement, false);
      self.light = new BABYLON.PointLight('light', self.camera.position, self.scene);
      console.log("Create Scene Promise End")
      self.loadModel(self, resolve, reject);
    });
  }

  render(): void {
    // run the render loop
    console.log("Render!");
    
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  loadModel(self, resolve, reject){
    console.log("Load Model Start")
    // self.engine.stopRenderLoop();
    if(self.luchador3d)
    {
      self.luchador3d.dispose();
      // let scene : BABYLON.Scene = self.scene;
      // let luchador3d : Luchador3D = self.luchador3d;
      // luchador3d.
      // scene.getMeshByID(self.luchador3d.mesh.id).dispose();
      console.log("disposed!");
    }
    
    self.luchador3d = new Luchador3D(
        self.dummyLuchador(),
        self.scene,
        new Vector3(0, 0, 0),
        1,
        1
      );
    
      
    console.log("Load Model End")
    self.builder.loadDynamicLuchadorTexture(self.luchador3d, self.luchador, resolve, reject);
    // self.engine.stopRenderLoop();
    self.render();
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
