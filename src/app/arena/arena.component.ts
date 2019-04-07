import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Luchador3D } from './luchador3d';
import { MainLoginRequest, MainLuchador } from '../sdk';
import { Observable, interval, Subject } from 'rxjs';
import {
  GameDefinition,
  MatchState,
  Luchador,
  Bullet
} from '../watch-match/watch-match.model';
import { Box3D } from './box3d';
import { Bullet3D } from './bullet3d';
import { Helper3D } from './helper3d';
import { Scene3D } from './scene3d';
import { GroundTile3D } from './ground-tile3D';
import { Wall3D } from './wall3D';
import { Single3D } from './single3D';
import { Random3D } from './random3D';
import { Square3D } from './square3D';
import { SceneBuilder } from './scene.builder3D';
import { TextureBuilder } from './texture-builder';
import { ActivatedRoute } from '@angular/router';

class SavedCamera {
  target: BABYLON.Vector3;
  position: BABYLON.Vector3;
}

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit, OnChanges {

  @ViewChild('game') canvas;
  @Input() gameDefinition: GameDefinition;
  @Input() matchStateSubject: Subject<MatchState>;
  @Input() debug = false;
  @Input() cameraFollowLuchador = true;
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
  scene3D: Scene3D; //can remove?

  private currentLuchadorData : MainLuchador;

  readonly CAMERA_POSITION = new BABYLON.Vector3(0, 28, -20);
  readonly ROBOLUCHA_SAVED_CAMERA = "robolucha-saved-camera";
  cameraZoom = new BABYLON.Vector3(0, 0, 0);
  cameraZoomLevel = 0;
  cameraZoomLevels = [-5, 20];

  constructor(private builder: TextureBuilder, 
    private route: ActivatedRoute) {
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
      console.error('currentLuchador missing');
      return;
    }
    const data = this.route.snapshot.data;
    this.currentLuchadorData = data.luchador;

    this.HALF_LUCHADOR = this.convertPosition(
      this.gameDefinition.luchadorSize / 2
    );

    this.HALF_BULLET = this.convertPosition(this.gameDefinition.bulletSize / 2);

    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.nextMatchState = matchState;
    });

    this.createScene();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.cameraFollowLuchador) {
      this.setCameraFromSavedState();
    }
  }

  setCameraFromSavedState() {
    const savedCameraState = localStorage.getItem(this.ROBOLUCHA_SAVED_CAMERA);
    console.log(this.ROBOLUCHA_SAVED_CAMERA, savedCameraState);

    if (savedCameraState) {
      const cameraState: SavedCamera = JSON.parse(savedCameraState);

      this.camera.position.set(
        cameraState.position.x,
        cameraState.position.y,
        cameraState.position.z);

      this.camera.setTarget(new BABYLON.Vector3(
        cameraState.target.x,
        cameraState.target.y,
        cameraState.target.z));
    }
  }

  saveCameraState() {
    let cameraState: SavedCamera = {
      position: this.camera.position,
      target: this.camera.getTarget()
    };

    const savedCameraState = JSON.stringify(cameraState);
    localStorage.setItem(this.ROBOLUCHA_SAVED_CAMERA, savedCameraState);
  }

  createScene(): void {
    this.engine.displayLoadingUI();
    this.engine.loadingUIText = "Loading the arena";

    this.scene = new BABYLON.Scene(this.engine);

    const lightPosition = new BABYLON.Vector3(10, 10, -15);
    this.light = new BABYLON.HemisphericLight(
      'light1',
      lightPosition,
      this.scene
    );

    const builder = new SceneBuilder(this.scene, this.gameDefinition);
    Promise.all([
      this.updateLuchadores(),
      builder.build()])
      .then(() => {
        console.log("finished loading");
        this.engine.hideLoadingUI();
        this.render();
      });

    this.camera = new BABYLON.FreeCamera(
      'camera1',
      this.CAMERA_POSITION,
      this.scene
    );

    this.camera.rotation.x = Helper3D.angle2radian(45);
    this.camera.attachControl(this.canvas.nativeElement, false);

    if (!this.cameraFollowLuchador) {
      this.setCameraFromSavedState();
    }

    if (this.debug) {
      Helper3D.showAxis(this.scene, 5);
    }

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
    if (luchador3D && this.cameraFollowLuchador) {
      const position = this.CAMERA_POSITION.add(luchador3D.getPosition());
      this.camera.position = position;
      this.camera.setTarget(luchador3D.getPosition());
    } else {
      this.saveCameraState();
    }
  }

  removeBullets(): any {
    this.currentMatchState.bullets.forEach((bullet: Bullet) => {
      const found = this.nextMatchState.bullets.find((search: Bullet) => {
        return search.id === bullet.id;
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
      const current = this.currentMatchState.bullets.find((search: Bullet) => {
        return search.id === bullet.id;
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
    const loaders = [];
    this.nextMatchState.luchadores.forEach((luchador: Luchador) => {
      const currentState = this.currentMatchState.luchadores.find(
        (search: Luchador) => {
          return search.state.id === luchador.state.id;
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
        const vehicleRotation = Helper3D.angle2radian(luchador.state.angle);
        const gunRotation = Helper3D.angle2radian(luchador.state.gunAngle);
        
        const newLuchador = new Luchador3D(
          luchador,
          this.builder,
          this.scene,
          position,
          vehicleRotation,
          gunRotation
        );

        loaders.push(newLuchador.loader);
      }
    });
    return Promise.all(loaders);
  }

  readonly LUCHADOR_DEFAULT_Y = 0.0;

  calculatePosition(luchador: Luchador): BABYLON.Vector3 {
    const result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(luchador.state.x) + this.HALF_LUCHADOR;
    result.y = this.LUCHADOR_DEFAULT_Y;
    result.z = this.convertPosition(luchador.state.y) + this.HALF_LUCHADOR;
    return result;
  }

  calculateBulletPosition(bullet: Bullet): BABYLON.Vector3 {
    // TODO: add marker at the model to define the Y of the bullet
    const DEFAULT_Y = 1.5;

    const result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(bullet.x) + this.HALF_BULLET;
    result.y = DEFAULT_Y;
    result.z = this.convertPosition(bullet.y) + this.HALF_BULLET;
    return result;
  }

  removeLuchadores(): any {
    this.currentMatchState.luchadores.forEach((luchador: Luchador) => {
      const found = this.nextMatchState.luchadores.find((search: Luchador) => {
        return search.state.id === luchador.state.id;
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
    value = Helper3D.angle2radian(value) * -1;
    luchador3D.rotateVehicle(value);
  }

  gunRotation(luchador3D: Luchador3D, current: Luchador, next: Luchador): any {
    let value = next.state.gunAngle;
    value = this.fixAngle(value);
    // * -1 to revert the direction so it matches the cartesian plane
    value = Helper3D.angle2radian(value) * -1;
    luchador3D.rotateGun(value);
  }

  convertPosition(n: number) {
    const result: number = n / this.gameDefinition.luchadorSize;
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
