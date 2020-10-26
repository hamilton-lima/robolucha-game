import { Injectable } from '@angular/core';
import { ModelSceneComponent } from 'src/app/sdk';

@Injectable({
  providedIn: 'root'
})
export class SceneComponentBuilderService {
  lastX = 0;
  lastY = 0;
  readonly WIDTH = 60;
  readonly HEIGHT = 60;
  readonly TYPES =  ["wall", "region"];
  readonly DEFAULT_TYPE = 0;

  getTypes(){
    return this.TYPES;
  }

  build(): ModelSceneComponent {
    const result = <ModelSceneComponent> {
      alpha: 1,
      blockMovement: true,
      codes: [],
      colider: true,
      height: this.HEIGHT,
      life: 0,
      respawn: false,
      rotation: 0,
      showInRadar: true,
      type: this.TYPES[this.DEFAULT_TYPE],
      width: this.WIDTH,
      x: this.lastX + this.WIDTH,
      y: this.lastY,
      color: "#00FF00"
    }

    this.lastX = result.x;
    this.lastY = result.y;
    
    return result;
  }

 constructor() { }
}


