import { Injectable } from "@angular/core";
import { ModelGameDefinition, ModelSceneComponent } from "src/app/sdk";
import {
  MatchState,
  SceneComponent,
} from "src/app/watch-match/watch-match.model";

@Injectable({
  providedIn: "root",
})
export class MatchStateBuilderService {
  build(components: ModelSceneComponent[]): MatchState {
    const result = <MatchState>{
      bullets:[],
      clock: 0,
      events:[],
      luchadores:[],
      punches:[],
      scores:[],
      sceneComponents: this.buildSceneComponents(components),
    };
    console.log("builder", components);
    return result;
  }

  buildSceneComponents(
    sceneComponents: ModelSceneComponent[]
  ): SceneComponent[] {
    const result: SceneComponent[] = [];
    
    sceneComponents.forEach((component) => {
      const item = <SceneComponent>{
        alpha: component.alpha,
        color: component.color,
        height: component.height,
        rotation: component.rotation,
        type: component.type,
        width: component.width,
        x: component.x,
        y: component.y,
      };
      result.push(item);
    });

    return result;
  }

  constructor() {}
}
