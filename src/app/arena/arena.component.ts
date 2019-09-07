import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import * as BABYLON from "babylonjs";
import { Luchador3D } from "./luchador3d";
import { DefaultService } from "../sdk";
import { Subject } from "rxjs";
import {
  GameDefinition,
  MatchState,
  Luchador,
  Bullet,
  SceneComponent
} from "../watch-match/watch-match.model";
import { Bullet3D } from "./bullet3d";
import { Helper3D } from "./helper3d";
import { SceneComponent3D } from "./scenecomponent3D";
import { SceneBuilder } from "./scene.builder3D";
import { TextureBuilder } from "./texture-builder";
import { ActivatedRoute } from "@angular/router";
import { SharedConstants } from "./shared.constants";

class SavedCamera {
  target: BABYLON.Vector3;
  position: BABYLON.Vector3;
}

@Component({
  selector: "app-arena",
  templateUrl: "./arena.component.html",
  styleUrls: ["./arena.component.css"]
})
export class ArenaComponent implements OnInit, OnChanges {
  @ViewChild("game") canvas;
  @Input() gameDefinition: GameDefinition;
  @Input() matchStateSubject: Subject<MatchState>;
  @Input() debug = false;
  @Input() cameraFollowLuchador = true;
  @Input() currentLuchador: number;
  @Input() animateSubject: Subject<string>;
  @Input() messageFPS: Subject<number>;

  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private light: BABYLON.HemisphericLight;

  private luchadores: Array<Luchador3D>;
  private sceneComponents: Array<SceneComponent3D>;
  private bullets: Array<Bullet3D>;

  private currentMatchState: MatchState;
  private nextMatchState: MatchState;

  private HALF_LUCHADOR: number;
  private HALF_BULLET: number;

  readonly CAMERA_POSITION = new BABYLON.Vector3(0, 28, -20);
  readonly ROBOLUCHA_SAVED_CAMERA = "robolucha-saved-camera";
  cameraZoom = new BABYLON.Vector3(0, 0, 0);
  cameraZoomLevel = 0;
  cameraZoomLevels = [-5, 20];

  private shadowGenerator: BABYLON.ShadowGenerator;

  constructor(private builder: TextureBuilder, private api: DefaultService) {
    this.resetState();
  }

  fitToContainer() {
    var canvas = this.canvas.nativeElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  ngOnInit() {
    if (!this.currentLuchador) {
      console.error("currentLuchador missing");
      return;
    }

    this.createScene();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.cameraFollowLuchador) {
      this.setCameraFromSavedState();
    }
  }

  setCameraFromSavedState() {
    const savedCameraState = localStorage.getItem(this.ROBOLUCHA_SAVED_CAMERA);

    if (savedCameraState) {
      const cameraState: SavedCamera = JSON.parse(savedCameraState);

      this.camera.position.set(
        cameraState.position.x,
        cameraState.position.y,
        cameraState.position.z
      );

      this.camera.setTarget(
        new BABYLON.Vector3(
          cameraState.target.x,
          cameraState.target.y,
          cameraState.target.z
        )
      );
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

  resetState() {
    this.currentMatchState = {
      events: [],
      bullets: [],
      luchadores: [],
      sceneComponents: [],
      punches: [],
      scores: [],
      clock: 0
    };

    this.nextMatchState = {
      events: [],
      bullets: [],
      luchadores: [],
      sceneComponents: [],
      punches: [],
      scores: [],
      clock: 0
    };

    this.luchadores = [];
    this.bullets = [];
    this.sceneComponents = [];
  }

  createScene(): void {
    if (this.engine) {
      this.engine.dispose();
    }

    this.resetState();

    this.HALF_LUCHADOR = this.convertPosition(
      this.gameDefinition.luchadorSize / 2
    );
    this.HALF_BULLET = this.convertPosition(this.gameDefinition.bulletSize / 2);

    this.fitToContainer();
    this.engine = new BABYLON.Engine(this.canvas.nativeElement, true);

    this.matchStateSubject.subscribe((matchState: MatchState) => {
      this.nextMatchState = matchState;
    });

    if (this.animateSubject) {
      this.animateSubject.subscribe(name => {
        this.luchadores.forEach(luchador => {
          luchador.animateFrom(name);
        });
      });
    }

    if (this.messageFPS) {
      this.messageFPS.subscribe(fps => {
        // console.log(
        //   "FPS: messages:" + fps + ", render: " + this.engine.getFps()
        // );
      });
    }

    this.engine.displayLoadingUI();
    this.engine.loadingUIText = "Loading the arena";

    this.scene = new BABYLON.Scene(this.engine);

    const lightPosition = new BABYLON.Vector3(10, 10, -15);
    this.light = new BABYLON.HemisphericLight(
      "light1",
      lightPosition,
      this.scene
    );

    var light2 = new BABYLON.DirectionalLight(
      "dir01",
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light2.position = new BABYLON.Vector3(10, 5, 5);

    // Shadows
    this.shadowGenerator = new BABYLON.ShadowGenerator(512, light2);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.blurKernel = 32;

    const builder = new SceneBuilder(this.scene, this.gameDefinition);
    Promise.all([this.updateLuchadores(), builder.build()]).then(() => {
      console.log("finished loading");
      this.engine.hideLoadingUI();
      this.render();
    });

    this.camera = new BABYLON.FreeCamera(
      "camera1",
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

    this.updateSceneComponents();
    this.removeSceneComponents();

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
        this.updateBullet(bullet3D, bullet);
      } else {
        // not found add to the scene
        const position = this.calculateBulletPosition(bullet);
        const newBullet = new Bullet3D(this.scene, position, bullet);
        this.bullets[bullet.id] = newBullet;

        // animate luchador owner of the bullet
        const luchador3D = this.luchadores[bullet.owner];
        if (luchador3D) {
          luchador3D.animateFire();
        }
      }
    });
  }

  updateSceneComponents() {
    this.nextMatchState.sceneComponents.forEach((component: SceneComponent) => {
      const currentState = this.currentMatchState.sceneComponents.find(
        (search: SceneComponent) => {
          return search.id === component.id;
        }
      );

      // found update the state
      if (currentState) {
        const scenecomponent3D = this.sceneComponents[component.id];
        this.updateComponent(scenecomponent3D, component);
      } else {
        // not found add to the scene
        const position = this.calculateComponentPosition(component);
        const rotation = Helper3D.angle2radian(component.rotation);
        const width = this.convertPosition(component.width);
        const height = this.convertPosition(component.height);
        // create new SceneComponent3D
        const newComponent = new SceneComponent3D(
          component.id,
          this.scene,
          position,
          width,
          height,
          rotation,
          component.type,
          component.color,
          component.alpha
        );

        this.sceneComponents[component.id] = newComponent;
      }
    });
  }

  updateLuchadores() {
    const loaders = [];
    this.nextMatchState.luchadores.forEach((luchador: Luchador) => {
      const currentState = this.currentMatchState.luchadores.find(
        (search: Luchador) => {
          return search.id === luchador.id;
        }
      );

      if (currentState) {
        // found update the state
        const luchador3D = this.luchadores[luchador.id];

        if (luchador.lastOnfound > 0) {
          const elapsed = Math.abs(
            luchador.lastOnfound - currentState.lastOnfound
          );
          if (elapsed > 1000) {
            luchador3D.animateFound();
          }
        }

        this.update(luchador3D, luchador);
        this.vehicleRotation(luchador3D, luchador);
        this.gunRotation(luchador3D, luchador);
      } else {
        // not found add to the scene
        const position = this.calculatePosition(luchador);
        const vehicleRotation = Helper3D.angle2radian(luchador.angle);
        const gunRotation = Helper3D.angle2radian(luchador.gunAngle);

        // create new luchador3D
        const newLuchador = new Luchador3D(
          luchador.id,
          luchador.name,
          this.scene,
          this.loadMask(luchador.id),
          position,
          vehicleRotation,
          gunRotation,
          45,
          this.convertPosition(420),
          this.shadowGenerator
        );

        // save the new luchador3D
        this.luchadores[luchador.id] = newLuchador;

        // add luchador3D loaders to the list of loaders
        loaders.push(newLuchador.loader);
      }
    });

    // combine all loaders in a single promise
    return Promise.all(loaders);
  }

  loadMask(id: number): Promise<BABYLON.StandardMaterial> {
    return new Promise<BABYLON.StandardMaterial>((resolve, reject) => {
      // read the mask from the API
      this.api.privateMaskConfigIdGet(id).subscribe(configs => {
        // console.log("mask config loaded", id, configs);

        // build the material using dynamic texture
        this.builder.loadDynamicTexture(configs, this.scene).then(material => {
          // console.log("dynamic texture loaded loaded", id, material);
          resolve(material);
        });
      });
    });
  }

  readonly LUCHADOR_DEFAULT_Y = 0.2;
  readonly COMPONENT_DEFAULT_Y = 0.2;

  calculatePosition(luchador: Luchador): BABYLON.Vector3 {
    const result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x = this.convertPosition(luchador.x);
    result.y = this.LUCHADOR_DEFAULT_Y;
    result.z = this.convertPosition(luchador.y);
    return result;
  }

  calculateComponentPosition(component: SceneComponent): BABYLON.Vector3 {
    const result: BABYLON.Vector3 = new BABYLON.Vector3();
    result.x =
      this.convertPosition(component.x) +
      this.convertPosition(component.width / 2);
    result.y = this.COMPONENT_DEFAULT_Y;
    result.z =
      this.convertPosition(component.y) +
      this.convertPosition(component.height / 2);
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

  removeLuchadores() {
    this.currentMatchState.luchadores.forEach((luchador: Luchador) => {
      const found = this.nextMatchState.luchadores.find((search: Luchador) => {
        return search.id === luchador.id;
      });

      if (!found) {
        // not found remove from the scene
        const luchador3D = this.luchadores[luchador.id];
        luchador3D.dispose();
        delete this.bullets[luchador.id];
      }
    });
  }

  removeSceneComponents() {
    this.currentMatchState.sceneComponents.forEach(
      (component: SceneComponent) => {
        const found = this.nextMatchState.sceneComponents.find(
          (search: SceneComponent) => {
            return search.id === component.id;
          }
        );

        if (!found) {
          // not found remove from the scene
          const component3D = this.sceneComponents[component.id];
          component3D.dispose();
        }
      }
    );
  }

  update(luchador3D: Luchador3D, next: Luchador) {
    if (luchador3D.getHealth() > next.life) {
      luchador3D.animateHit();
    }

    const x = this.convertPosition(next.x);
    const z = this.convertPosition(next.y);
    luchador3D.moveTo(x, z);
    luchador3D.setHealth(next.life);
    luchador3D.setLabel(next.name);
  }

  updateComponent(component3D: SceneComponent3D, component: SceneComponent) {
    const x =
      this.convertPosition(component.x) +
      this.convertPosition(component.width / 2);
    const z =
      this.convertPosition(component.y) +
      this.convertPosition(component.height / 2);
    const width = this.convertPosition(component.width);
    const height = this.convertPosition(component.height);
    component3D.moveTo(x, z);
    component3D.resize(width, height);
    component3D.setColor(component.color);
  }

  updateBullet(bullet3D: Bullet3D, next: Bullet) {
    const x = this.convertPosition(next.x) + this.HALF_BULLET;
    const z = this.convertPosition(next.y) + this.HALF_BULLET;
    bullet3D.moveTo(x, z);
  }

  vehicleRotation(luchador3D: Luchador3D, next: Luchador) {
    let value = next.angle;
    value = this.fixAngle(value);
    // * -1 to revert the direction so it matches the cartesian plane
    value = Helper3D.angle2radian(value) * -1;
    luchador3D.rotateVehicle(value);
  }

  gunRotation(luchador3D: Luchador3D, next: Luchador): any {
    let value = next.gunAngle;
    value = this.fixAngle(value);
    // * -1 to revert the direction so it matches the cartesian plane
    value = Helper3D.angle2radian(value) * -1;
    luchador3D.rotateGun(value);
  }

  convertPosition(n: number) {
    const result: number =
      n *
      (SharedConstants.LUCHADOR_MODEL_WIDTH / this.gameDefinition.luchadorSize);

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
