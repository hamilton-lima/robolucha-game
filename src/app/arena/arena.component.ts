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
import { Box3D } from "./box3d";

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
    const lightAndCameraPosition = new BABYLON.Vector3(10, 10, -15);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new BABYLON.HemisphericLight(
      "light1",
      lightAndCameraPosition,
      this.scene
    );

    // create ground
    const groundWidth =
      this.gameDefinition.arenaWidth / this.gameDefinition.luchadorSize;
    const groundHeight =
      this.gameDefinition.arenaHeight / this.gameDefinition.luchadorSize;

    let ground = BABYLON.MeshBuilder.CreateGround(
      "ground1",
      { width: groundWidth, height: groundHeight, subdivisions: 16 },
      this.scene
    );

    ground.position.x = groundWidth / 2;
    ground.position.z = groundHeight / 2;

    let material = new BABYLON.StandardMaterial("ground-material", this.scene);
    material.diffuseColor = BABYLON.Color3.FromHexString("#2C401B"); // BABYLON.Color3.Random();
    ground.material = material;

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    this.camera = new BABYLON.FreeCamera(
      "camera1",
      lightAndCameraPosition,
      this.scene
    );

    this.camera.rotation.x = this.angle2radian(45);

    // target the camera to scene origin
    this.camera.setTarget(ground.position);

    // attach the camera to the canvas
    this.camera.attachControl(this.canvas.nativeElement, false);

    // new Box3D(this.scene);
  }

  createGround() {}

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

        this.updateX(luchador3D, currentLuchador, luchador);
        this.updateZ(luchador3D, currentLuchador, luchador);
        this.vehicleRotation(luchador3D, currentLuchador, luchador);
        this.gunRotation(luchador3D, currentLuchador, luchador);

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

  updateX(luchador3D: Luchador3D, current: Luchador, next: Luchador): any {
    const value =
      this.convertPosition(next.state.x) -
      this.convertPosition(current.state.x);
    luchador3D.moveX(value);
  }

  updateZ(luchador3D: Luchador3D, current: Luchador, next: Luchador): any {
    const value =
      this.convertPosition(next.state.y) -
      this.convertPosition(current.state.y);
    luchador3D.moveZ(value);
  }

  vehicleRotation(
    luchador3D: Luchador3D,
    current: Luchador,
    next: Luchador
  ): any {
    let value = next.state.angle - current.state.angle;
    value = this.fixAngle(value);
    value = this.angle2radian(value);
    luchador3D.rotateVehicle(value);
  }

  gunRotation(luchador3D: Luchador3D, current: Luchador, next: Luchador): any {
    let value = next.state.gunAngle - current.state.gunAngle;
    value = this.fixAngle(value);
    value = this.angle2radian(value);
    luchador3D.rotateGun(value);
  }

  // TODO: read this from luchador
  readonly turnSpeed: number = 180;

  fixAngle(value: number): number {
    if (Math.abs(value) > this.turnSpeed) {
      if (value > 0) {
        value = value - 360;
      } else {
        value = value + 360;
      }
    }
    return value;
  }
}
