import { Injectable } from "@angular/core";
import { RotationGizmo } from "babylonjs";
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
    return gameComponents.map((component) => {
      return <Luchador>{
        id: component.id,
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
        id: component.id,
        alpha: component.alpha,
        color: component.color,
        height: component.height,
        type: component.type,
        width: component.width,
        rotation: component.rotation,
        x: component.x,
        y: component.y,
      };
      result.push(item);
    });

    return result;
  }

  constructor() {}
}
