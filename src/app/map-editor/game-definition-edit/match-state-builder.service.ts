import { Injectable } from "@angular/core";
import {
  ModelGameComponent,
  ModelGameDefinition,
  ModelSceneComponent,
} from "src/app/sdk";
import {
  Luchador,
  MatchState,
  SceneComponent,
} from "src/app/watch-match/watch-match.model";

@Injectable({
  providedIn: "root",
})
export class MatchStateBuilderService {

  build(
    sceneComponents: ModelSceneComponent[],
    gameComponents: ModelGameComponent[]
  ): MatchState {
    const result = <MatchState>{
      bullets: [],
      clock: 0,
      events: [],
      luchadores: this.buildGameComponents(gameComponents),
      punches: [],
      scores: [],
      sceneComponents: this.buildSceneComponents(sceneComponents),
    };
    return result;
  }

  buildGameComponents(gameComponents: ModelGameComponent[]): Luchador[] {
    let pos = 1;
    return gameComponents.map((component) => {
      return <Luchador>{
        id: pos++,
        name: component.name,
        x: component.x,
        y: component.y,
        life: component.life,
        angle: component.angle,
        gunAngle: component.gunAngle,
      };
    });
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
