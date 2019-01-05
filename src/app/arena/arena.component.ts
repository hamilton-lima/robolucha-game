import { Component, OnInit, ViewChild, Input } from "@angular/core";
import * as BABYLON from "babylonjs";
import { Luchador3D } from "./luchador3d";
import { MainLoginRequest, MainLuchador } from "../sdk";
import { Observable, interval, Subject } from "rxjs";
import {
  GameDefinition,
  MatchState,
  Luchador
} from "../watch-match/watch-match.model";

@Component({
  selector: "app-arena",
  templateUrl: "./arena.component.html",
  styleUrls: ["./arena.component.css"]
})
export class ArenaComponent implements OnInit {
  @ViewChild("game") canvas;
  @Input() gameDefinition: GameDefinition;
  @Input() matchStateSubject: Subject<MatchState>;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;
  private luchadores: Array<Luchador3D>;

  private currentMatchState: MatchState;
  private nextMatchState: MatchState;

  constructor() {
    this.currentMatchState = {
      events: [],
      bullets: [],
      luchadores: [],
      punches: [],
      scores: [],
      clock: 0
    };

    this.nextMatchState = {
      events: [],
      bullets: [],
      luchadores: [],
      punches: [],
      scores: [],
      clock: 0
    };

    this.luchadores = [];
  }

  ngOnInit() {
    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);
    this.createScene();
    this.render();

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.nextMatchState = matchState;
    });
  }

  createScene(): void {
    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    this.camera = new BABYLON.FreeCamera(
      "camera1",
      new BABYLON.Vector3(0, 15, -15),
      this.scene
    );

    // target the camera to scene origin
    this.camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    this.camera.attachControl(this.canvas.nativeElement, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    const groundWidth =
      this.gameDefinition.arenaWidth / this.gameDefinition.luchadorSize;
    const groundHeight =
      this.gameDefinition.arenaHeight / this.gameDefinition.luchadorSize;

    // create a built-in "ground" shape
    let ground = BABYLON.MeshBuilder.CreateGround(
      "ground1",
      { width: groundWidth, height: groundHeight, subdivisions: 16 },
      this.scene
    );

    let material = new BABYLON.StandardMaterial("ground-material", this.scene);
    // material.diffuseColor = BABYLON.Color3.FromHexString("#2C401B"); // BABYLON.Color3.Random();
    material.diffuseColor = BABYLON.Color3.Random();
    ground.material = material;
  }

  render(): void {
    // run the render loop
    this.engine.runRenderLoop(() => {
      this.updateCurrentMatchState();
      this.scene.render();
    });
  }

  // compare currentMatchState with nextMatchState
  updateCurrentMatchState(): any {
    this.updateLuchadores();
    this.removeLuchadores();
    this.currentMatchState = this.nextMatchState;
  }

  updateLuchadores(): any {
    this.nextMatchState.luchadores.forEach((luchador: Luchador) => {
      let currentLuchador = this.currentMatchState.luchadores.find(
        (search: Luchador) => {
          return search.state.id == luchador.state.id;
        }
      );

      // found update the state
      if (currentLuchador) {
        // console.log("luchador found will update",luchador.name);
        const luchador3D = this.luchadores[luchador.state.id];

        this.updateX(luchador3D, luchador);
        this.updateZ(luchador3D, luchador);
        this.vehicleRotation(luchador3D, luchador);
        this.gunRotation(luchador3D, luchador);

        // not found add to the scene
      } else {
        // console.log("luchador NOT found will create ",luchador.name);
        const position = this.calculatePosition(luchador);
        const vehicleRotation = this.angle2radian(luchador.state.angle);
        const gunRotation = this.angle2radian(luchador.state.gunAngle);

        const newLuchador = new Luchador3D(
          luchador,
          this.scene,
          position,
          vehicleRotation,
          gunRotation
        );

        this.luchadores[luchador.state.id] = newLuchador;
      }
    });
  }

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }

  convertPosition(n: number) {
    return n / this.gameDefinition.luchadorSize;
  }

  calculatePosition(luchador: Luchador): BABYLON.Vector3 {
    // TODO: reset this when the model gets resized to 1
    const DEFAULT_Y = 1.1;

    let result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(luchador.state.x);
    result.y = DEFAULT_Y;
    result.z = this.convertPosition(luchador.state.y);
    return result;
  }

  removeLuchadores(): any {
    // TODO: implement this
  }

  updateX(luchador3D: Luchador3D, next: Luchador): any {
    const value = this.convertPosition(next.state.x);
    luchador3D.moveX(value);
  }

  updateZ(luchador3D: Luchador3D, next: Luchador): any {
    const value = this.convertPosition(next.state.y);
    luchador3D.moveZ(value);
  }

  vehicleRotation(luchador3D: Luchador3D, next: Luchador): any {
    const value = this.angle2radian(next.state.angle);
    luchador3D.rotateVehicle(value);
  }

  gunRotation(luchador3D: Luchador3D, next: Luchador): any {
    const value = this.angle2radian(next.state.gunAngle);
    luchador3D.rotateGun(value);
  }
}
