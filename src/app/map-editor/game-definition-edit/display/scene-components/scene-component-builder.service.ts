import { Injectable } from "@angular/core";
import { ModelSceneComponent } from "src/app/sdk";
import { ModelSceneComponentEditWrapper } from "../../game-definition-edit-mediator.service";

@Injectable()
export class SceneComponentBuilderService {
  x = 0;
  y = 0;
  readonly WIDTH = 60;
  readonly HEIGHT = 60;
  readonly TYPES = ["wall", "region"];
  readonly DEFAULT_TYPE = 0;
  id = 1;

  constructor() {}

  getTypes() {
    return this.TYPES;
  }

  build(): ModelSceneComponent {
    const tempID = (new Date()).getTime() * -1;

    const result = <ModelSceneComponent>{
      id: tempID,
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
      x: this.x,
      y: this.y,
      color: "#00FF00",
    };

    this.x = result.x + this.WIDTH;
    this.y = result.y;

    return result;
  }

  // Build list with local ID to allow reference for edit
  buildWrapperList(
    gameComponents: ModelSceneComponent[]
  ): ModelSceneComponentEditWrapper[] {
    return gameComponents.map((component) => this.buildWrapper(component));
  }

  buildWrapper(component: ModelSceneComponent): ModelSceneComponentEditWrapper {
    return <ModelSceneComponentEditWrapper>{
      id: this.id++,
      component: component,
    };
  }

  unWrapList(wrapped: ModelSceneComponentEditWrapper[]): ModelSceneComponent[] {
    return wrapped.map((w) => w.component);
  }
}
