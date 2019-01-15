import { Component, OnInit, ViewChild, Input } from "@angular/core";
import * as BABYLON from "babylonjs";
import { Luchador3D } from "./luchador3d";
import { MainLoginRequest, MainLuchador } from "../sdk";
import { Observable, interval, Subject } from "rxjs";
import {
  GameDefinition,
  MatchState,
  Luchador,
  Bullet
} from "../watch-match/watch-match.model";
import { Box3D } from "./box3d";
import { Bullet3D } from "./bullet3d";
import { Helper3D } from "./helper3d";

@Component({
  selector: "app-arena",
  templateUrl: "./arena.component.html",
  styleUrls: ["./arena.component.css"]
})
export class ArenaComponent implements OnInit {
  @ViewChild("game") canvas;
  @Input() gameDefinition: GameDefinition;
  @Input() matchStateSubject: Subject<MatchState>;
  @Input() debug: boolean = false;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;

  private luchadores: Array<Luchador3D>;
  private bullets: Array<Bullet3D>;

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
    this.bullets = [];
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
    const groundWidth = this.convertPosition(this.gameDefinition.arenaWidth);
    const groundHeight = this.convertPosition(this.gameDefinition.arenaHeight);

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

    if( this.debug ){
      Helper3D.showAxis(this.scene, 5);
    }

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
  updateCurrentMatchState() {
    this.updateLuchadores();
    this.removeLuchadores();

    this.updateBullets();
    this.removeBullets();
    this.currentMatchState = this.nextMatchState;
  }

  removeBullets(): any {
    this.currentMatchState.bullets.forEach((bullet: Bullet) => {
      let found = this.nextMatchState.bullets.find((search: Bullet) => {
        return search.id == bullet.id;
      });

      if (!found) {
        // not found remove from the scene
        const bullet3D = this.bullets[bullet.id];
        bullet3D.dispose();
        delete this.bullets[bullet.id];
      }
    });
  }

  updateBullets(): any {
    this.nextMatchState.bullets.forEach((bullet: Bullet) => {
      let current = this.currentMatchState.bullets.find((search: Bullet) => {
        return search.id == bullet.id;
      });

      if (current) {
        // found update the state
        const bullet3D = this.bullets[bullet.id];
        this.updateBullet(bullet3D, current, bullet);
      } else {
        // not found add to the scene
        const position = this.calculateBulletPosition(bullet);
        const newBullet = new Bullet3D(this.scene, position, bullet);
        this.bullets[bullet.id] = newBullet;
      }
    });
  }

  updateLuchadores() {
    this.nextMatchState.luchadores.forEach((luchador: Luchador) => {
      let currentLuchador = this.currentMatchState.luchadores.find(
        (search: Luchador) => {
          return search.state.id == luchador.state.id;
        }
      );

      if (currentLuchador) {
        // found update the state
        const luchador3D = this.luchadores[luchador.state.id];

        this.update(luchador3D, currentLuchador, luchador);
        this.vehicleRotation(luchador3D, currentLuchador, luchador);
        this.gunRotation(luchador3D, currentLuchador, luchador);
      } else {
        // not found add to the scene
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

  // used to centralize the mesh around the x,y position
  halfLuchador() {
    return this.convertPosition(this.gameDefinition.luchadorSize / 2);
  }

  readonly LUCHADOR_DEFAULT_Y = 0.5;

  calculatePosition(luchador: Luchador): BABYLON.Vector3 {
    // TODO: reset this when the model gets resized to 1

    let result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(luchador.state.x) + this.halfLuchador();
    result.y = this.LUCHADOR_DEFAULT_Y;
    result.z = this.convertPosition(luchador.state.y) + this.halfLuchador();
    return result;
  }

  calculateBulletPosition(bullet: Bullet): BABYLON.Vector3 {
    // TODO: add marker at the model to define the Y of the bullet
    const DEFAULT_Y = 0.5;

    let result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(bullet.x);
    result.y = DEFAULT_Y;
    result.z = this.convertPosition(bullet.y);
    return result;
  }

  removeLuchadores(): any {
    this.currentMatchState.luchadores.forEach((luchador: Luchador) => {
      let found = this.nextMatchState.luchadores.find((search: Luchador) => {
        return search.state.id == luchador.state.id;
      });

      if (!found) {
        // not found remove from the scene
        const luchador3D = this.luchadores[luchador.state.id];
        luchador3D.dispose();
        delete this.bullets[luchador.state.id];
      }
    });
  }

  update(luchador3D: Luchador3D, current: Luchador, next: Luchador) {
    const x =
      this.convertPosition(next.state.x) -
      this.convertPosition(current.state.x);
    const z =
      this.convertPosition(next.state.y) -
      this.convertPosition(current.state.y);
    luchador3D.move(x, z);
  }

  updateBullet(bullet3D: Bullet3D, current: Bullet, next: Bullet) {
    const x = this.convertPosition(next.x) - this.convertPosition(current.x);
    const z = this.convertPosition(next.y) - this.convertPosition(current.y);
    bullet3D.move(x, z);
  }

  vehicleRotation(luchador3D: Luchador3D, current: Luchador, next: Luchador) {
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

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }

  convertPosition(n: number) {
    return n / this.gameDefinition.luchadorSize;
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
