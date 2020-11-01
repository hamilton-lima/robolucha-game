import { Injectable } from '@angular/core';
import { ModelGameComponent } from 'src/app/sdk';
import { nameByRace } from "fantasy-name-generator";
 
@Injectable({
  providedIn: 'root'
})
export class GameComponentBuildService {
  x = 200;
  y = 120;
  readonly WIDTH = 60;

  build(): ModelGameComponent {
    const result = <ModelGameComponent> {
      name: this.randomName(),
      isNPC: true,
      life: 20,
      angle: 180,
      gunAngle: 270,
      x: this.x,
      y: this.y,
    }

    this.x = result.x + this.WIDTH;
    this.y = result.y;
    
    return result;
  }

  randomName(){
    const name = nameByRace("elf", { gender: "female" });
    console.log("name", name);
    return name;
  }

  constructor() { }
}
