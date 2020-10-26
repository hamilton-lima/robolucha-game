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
  build(gameDefinition: ModelGameDefinition): MatchState {
    const result = <MatchState>{
      sceneComponents: this.buildSceneComponents(
        gameDefinition.sceneComponents
      ),
    };
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
        id: component.id,
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
