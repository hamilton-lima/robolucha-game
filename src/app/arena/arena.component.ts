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
import { Scene3D } from "./scene3d";
import { GroundTile3D } from "./ground-tile3D";
import { Wall3D } from "./wall3D";
import { Single3D } from "./single3D";

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
  @Input() currentLuchador: number;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.Light;

  private luchadores: Array<Luchador3D>;
  private bullets: Array<Bullet3D>;

  private currentMatchState: MatchState;
  private nextMatchState: MatchState;

  private HALF_LUCHADOR: number;
  private HALF_BULLET: number;
  ground: BABYLON.Mesh;
  scene3D: Scene3D;

  readonly CAMERA_POSITION = new BABYLON.Vector3(0, 28, -20);
  cameraZoom = new BABYLON.Vector3(0, 0, 0);
  cameraZoomLevel = 0;
  cameraZoomLevels = [-5, 20];

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
    if (!this.currentLuchador) {
      console.error("currentLuchador missing");
      return;
    }

    this.HALF_LUCHADOR = this.convertPosition(
      this.gameDefinition.luchadorSize / 2
    );

    this.HALF_BULLET = this.convertPosition(this.gameDefinition.bulletSize / 2);

    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.nextMatchState = matchState;
    });

    this.createScene();
    // this.loadScene();
  }

  createScene(): void {
    const lightPosition = new BABYLON.Vector3(10, 10, -15);
    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    // create a basic light, aiming 0,1,0 - meaning, to the sky

    this.light = new BABYLON.HemisphericLight(
      "light1",
      lightPosition,
      this.scene
    );

    this.createGround();
    this.composeGround();
    this.composeWalls();
    this.addExtras();

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    this.camera = new BABYLON.FreeCamera(
      "camera1",
      this.CAMERA_POSITION,
      this.scene
    );

    this.camera.rotation.x = this.angle2radian(45);
    this.camera.attachControl(this.canvas.nativeElement, false);
    // new Box3D(this.scene);

    if (this.debug) {
      Helper3D.showAxis(this.scene, 5);
    }

    this.render();
  }

  addExtras(): any {
    let single = new Single3D(this.scene);
    single.loading.then(mesh => {
      let extra = mesh.clone("extra.0", null);
      const groundWidth = this.convertPosition(this.gameDefinition.arenaWidth);
      const max = 10;
      const rangeZ = [-6, -10];
      const rangeX = [-6, groundWidth];
      const rangeAngle = [0, 360];
      for (let x = 1; x <= max; x++) {
        let extra = mesh.clone("extra." + x, null);
        extra.isVisible = true;
        extra.position.y = 0;
        extra.position.x =
          rangeX[0] + Math.abs(rangeX[1] - rangeX[0]) * Math.random();
        extra.position.z =
          rangeZ[0] - Math.abs(rangeZ[1] - rangeZ[0]) * Math.random();
        extra.rotation.z = this.angle2radian(
          rangeAngle[0] +
            Math.abs(rangeAngle[1] - rangeAngle[0]) * Math.random()
        );
      }
    });
  }

  composeGround(): any {
    const groundWidth = this.convertPosition(this.gameDefinition.arenaWidth);
    const groundHeight = this.convertPosition(this.gameDefinition.arenaHeight);
    const tileSize = 2;

    let ground = new GroundTile3D(this.scene);
    ground.loading.then(mesh => {
      let tiles = [];
      for (let x = 0; x <= groundWidth; x += tileSize) {
        for (let z = 0; z <= groundHeight; z += tileSize) {
          let i = mesh.clone("tile-" + x + "." + z);
          i.position.x = x;
          i.position.y = 0;
          i.position.z = z;
        }
      }

      console.log(">>> ground loaded");
    });
  }

  composeWalls(): any {
    const width = this.convertPosition(this.gameDefinition.arenaWidth);
    const height = this.convertPosition(this.gameDefinition.arenaHeight);

    let wall = new Wall3D(this.scene);
    wall.loading.then(mesh => {
      const meshX = 2.49;
      const meshZ = 1.15;

      const bottomZ = -meshX;
      const topZ = height + meshX * 1.5;
      const topRotation = this.angle2radian(90);
      const bottomRotation = this.angle2radian(270);
      const verticalStep = meshZ;
      const maxZ = height + verticalStep;

      const leftX = -meshX;
      const rightX = width + meshX * 1.5;
      const rightRotation = this.angle2radian(180);
      const horizontalStep = meshZ;
      const maxX = width + horizontalStep;

      for (let x = 0; x < maxX; x += horizontalStep) {
        let iTop = mesh.clone("wall-" + x + "." + topZ, null);
        iTop.position.x = x + meshZ;
        iTop.position.y = 0;
        iTop.position.z = topZ;
        iTop.rotation.y = topRotation;
        iTop.isVisible = true;

        let iBottom = mesh.clone("wall-" + x + "." + bottomZ, null);
        iBottom.position.x = x;
        iBottom.position.y = 0;
        iBottom.position.z = bottomZ;
        iBottom.rotation.y = bottomRotation;
        iBottom.isVisible = true;
      }

      for (let z = 0; z < maxZ; z += verticalStep) {
        let iLeft = mesh.clone("wall-" + leftX + "." + z, null);
        iLeft.position.x = leftX;
        iLeft.position.y = 0;
        iLeft.position.z = z + meshZ;
        iLeft.isVisible = true;

        let iRight = mesh.clone("wall-" + rightX + "." + z, null);
        iRight.position.x = rightX;
        iRight.position.y = 0;
        iRight.position.z = z;
        iRight.rotation.y = rightRotation;
        iRight.isVisible = true;
      }
    });
  }

  loadScene() {
    let self = this;
    BABYLON.SceneLoader.Load(
      "assets/",
      "camera_and_light.babylon",
      this.engine,
      (scene: BABYLON.Scene) => {
        self.scene = scene;
        // // Attach camera

        console.log(">> loaded scene lights", scene.lights);
        console.log(">> loaded scene camera", scene.activeCamera);

        scene.lights.forEach(light => {
          console.log("light intensity", light.intensity);
          light.intensity = 0.7;
        });

        // self.scene.activeCamera.attachControl(self.canvas, false);
        self.createGroundFromModel();

        if (self.debug) {
          Helper3D.showAxis(self.scene, 5);
        }

        this.render();
      }
    );
  }

  createGroundFromModel() {
    this.scene3D = new Scene3D(this.scene);
  }

  createGround() {
    const multiplier = 10;
    const groundWidth =
      this.convertPosition(
        this.gameDefinition.arenaWidth + this.gameDefinition.luchadorSize
      ) * multiplier;

    const groundHeight =
      this.convertPosition(
        this.gameDefinition.arenaHeight + this.gameDefinition.luchadorSize
      ) * multiplier;

    this.ground = BABYLON.MeshBuilder.CreateGround(
      "ground1",
      { width: groundWidth, height: groundHeight, subdivisions: 16 },
      this.scene
    );

    console.log("ground dimensions", groundWidth, groundHeight);

    this.ground.position.x = -5; //groundWidth / 2 * -1;
    this.ground.position.z = -5; //groundHeight / 2 * -1;
    this.ground.position.y = -0.1;

    console.log(
      "ground dimensions",
      groundWidth,
      groundHeight,
      this.ground.position
    );

    let material = new BABYLON.StandardMaterial("ground-material", this.scene);
    material.diffuseColor = BABYLON.Color3.FromHexString("#619FD7"); // BABYLON.Color3.Random();
    this.ground.material = material;
  }

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
    this.updateCamera();
    this.currentMatchState = this.nextMatchState;
  }

  updateCamera(): any {
    const luchador3D = this.luchadores[this.currentLuchador];
    if (luchador3D) {
      const position = this.CAMERA_POSITION.add(luchador3D.getPosition());
      this.camera.position = position;
      this.camera.setTarget(luchador3D.getPosition());
    }
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
      let currentState = this.currentMatchState.luchadores.find(
        (search: Luchador) => {
          return search.state.id == luchador.state.id;
        }
      );

      if (currentState) {
        // found update the state
        const luchador3D = this.luchadores[luchador.state.id];

        this.update(luchador3D, currentState, luchador);
        this.vehicleRotation(luchador3D, currentState, luchador);
        this.gunRotation(luchador3D, currentState, luchador);
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

  readonly LUCHADOR_DEFAULT_Y = 0.0;

  calculatePosition(luchador: Luchador): BABYLON.Vector3 {
    let result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(luchador.state.x) + this.HALF_LUCHADOR;
    result.y = this.LUCHADOR_DEFAULT_Y;
    result.z = this.convertPosition(luchador.state.y) + this.HALF_LUCHADOR;
    return result;
  }

  calculateBulletPosition(bullet: Bullet): BABYLON.Vector3 {
    // TODO: add marker at the model to define the Y of the bullet
    const DEFAULT_Y = 1.5;

    let result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(bullet.x) + this.HALF_BULLET;
    result.y = DEFAULT_Y;
    result.z = this.convertPosition(bullet.y) + this.HALF_BULLET;
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
    const x = this.convertPosition(next.state.x) + this.HALF_LUCHADOR;
    const z = this.convertPosition(next.state.y) + this.HALF_LUCHADOR;
    luchador3D.moveTo(x, z);
  }

  updateBullet(bullet3D: Bullet3D, current: Bullet, next: Bullet) {
    const x = this.convertPosition(next.x) + this.HALF_BULLET;
    const z = this.convertPosition(next.y) + this.HALF_BULLET;
    bullet3D.moveTo(x, z);
  }

  vehicleRotation(luchador3D: Luchador3D, current: Luchador, next: Luchador) {
    let value = next.state.angle;
    value = this.fixAngle(value);
    // * -1 to revert the direction so it matches the cartesian plane
    value = this.angle2radian(value) * -1;
    luchador3D.rotateVehicle(value);
  }

  gunRotation(luchador3D: Luchador3D, current: Luchador, next: Luchador): any {
    let value = next.state.gunAngle;
    value = this.fixAngle(value);
    // * -1 to revert the direction so it matches the cartesian plane
    value = this.angle2radian(value) * -1;
    luchador3D.rotateGun(value);
  }

  readonly ANGLE2RADIAN = Math.PI / 180;
  angle2radian(angle: number): number {
    return angle * this.ANGLE2RADIAN;
  }

  convertPosition(n: number) {
    let result: number = n / this.gameDefinition.luchadorSize;
    return result;
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
