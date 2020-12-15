import { Injectable, EventEmitter } from '@angular/core';
import { GameDefinition } from "../watch-match/watch-match.model";
import { Pickable } from "src/app/arena/arena.component";
import { SharedConstants } from "./shared.constants";



export class DataMouse {
  startingPoint : boolean;
  currentPickedMesh : BABYLON.AbstractMesh;
}
  

@Injectable({
  providedIn: 'root'
})
export class ArenaMouseService {
  private scene: BABYLON.Scene;
  private gameDefinition: GameDefinition;
  private camera: BABYLON.FreeCamera;
  private engine: BABYLON.Engine;
  private event : EventEmitter<Pickable>;

  private data : DataMouse;

  constructor() { }

  setup(scene: BABYLON.Scene, gameDefinition: GameDefinition, camera: BABYLON.FreeCamera, engine: BABYLON.Engine, event : EventEmitter<Pickable>){
      this.scene = scene;
      this.gameDefinition = gameDefinition;
      this.camera = camera;
      this.engine = engine;
      this.event = event;
      this.data = new DataMouse();
    }

  getOnPointerDown () {
    const scene = this.scene;
    const camera = this.camera;
    const engine = this.engine;
    const event = this.event;
    const data = this.data;

          
    return function(){
      var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.pickedMesh.metadata != null && pickInfo.pickedMesh.metadata.type == "wall" || pickInfo.pickedMesh.metadata.type == "region") {

          pickInfo.pickedMesh.isPickable = false;
          data.currentPickedMesh = pickInfo.pickedMesh;
          data.startingPoint = true;
          let id = Number.parseInt(pickInfo.pickedMesh.id);

          event.emit(<Pickable>{
            id: id,
            name: pickInfo.pickedMesh.name,
            point: null,
            event:"down",
          });
          if (data.startingPoint) {
            camera.detachControl(engine.getRenderingCanvas());
          }
      }
    };
  }
  getOnPointerMove () {
    const scene = this.scene;
    const gameDefinition = this.gameDefinition;
    const event = this.event;
    const data = this.data;

    var convertPosition3DToComponent = function (n) {
      const result: number =
        n * gameDefinition.luchadorSize / SharedConstants.LUCHADOR_MODEL_WIDTH; //* 17.4;
  
      return result;
    }

    return function(){
      if (data.startingPoint) {
        var pick = scene.pick(scene.pointerX, scene.pointerY);
        var vec = new BABYLON.Vector3(convertPosition3DToComponent(pick.pickedPoint.x),0,convertPosition3DToComponent(pick.pickedPoint.z));
        event.emit(<Pickable>{
          id: 0,
          name: "",
          point:vec,
          event:"move",
        });
      }
    };
  } 

  getOnPointerUp() {
    const camera = this.camera;
    const engine = this.engine;
    const event = this.event;
    const data = this.data;
    console.log("camera", this.camera);
    console.log(this);
    return function(){
      if (data.startingPoint) {
        camera.attachControl(engine.getRenderingCanvas(), false);
        event.emit(<Pickable>{
            id: 0,
            name: "",
            point:null,
            event:"up",
          });
          data.currentPickedMesh.isPickable = true;
          data.startingPoint = false;
          return;
      }
    };
  }
}
