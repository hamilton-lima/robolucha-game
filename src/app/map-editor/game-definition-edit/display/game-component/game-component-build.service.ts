import { Injectable } from "@angular/core";
import { ModelGameComponent } from "src/app/sdk";
import { nameByRace } from "fantasy-name-generator";
import { ModelGameComponentEditWrapper } from "../../game-definition-edit-mediator.service";

@Injectable({
  providedIn: "root",
})
export class GameComponentBuildService {
  x = 200;
  y = 120;
  readonly WIDTH = 60;
  id = 1;

  constructor() {}

  build(): ModelGameComponent {
    const tempID = (new Date()).getTime() * -1;
    const result = <ModelGameComponent>{
      id: tempID,
      name: this.randomName(),
      isNPC: true,
      life: 20,
      angle: 180,
      gunAngle: 270,
      x: this.x,
      y: this.y,
    };

    this.x = result.x + this.WIDTH;
    this.y = result.y;

    return result;
  }

  randomName() {
    const name = nameByRace("elf", { gender: "female" });
    console.log("name", name);
    return name;
  }

  // Build list with local ID to allow reference for edit
  buildWrapperList(
    gameComponents: ModelGameComponent[]
  ): ModelGameComponentEditWrapper[] {
    return gameComponents.map((component) => this.buildWrapper(component));
  }

  buildWrapper(component: ModelGameComponent): ModelGameComponentEditWrapper {
    return <ModelGameComponentEditWrapper>{
      id: this.id++,
      component: component,
    };
  }

  unWrapList(
    wrapped: ModelGameComponentEditWrapper[]
  ): ModelGameComponent[] {
    return wrapped.map((w) => w.component);
  }
}
