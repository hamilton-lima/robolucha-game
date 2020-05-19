import { Injectable } from "@angular/core";
import { ModelUserDetails, ModelGameDefinition } from "../sdk";

@Injectable({
  providedIn: "root",
})
export class LevelControlService {
  constructor() {}

  public showAvailableMatch(
    userDetails: ModelUserDetails,
    gameDefinition: ModelGameDefinition
  ): boolean {

    // IF you can play, show the available match
    if (this.canPlay(userDetails, gameDefinition)){
      return true;
    } else {
      // ONLY shows if is not multiplayer
      if( gameDefinition.type !== "multiplayer"){
        return true;
      }
    }

  }

  public canPlay(
    userDetails: ModelUserDetails,
    gameDefinition: ModelGameDefinition
  ): boolean {
    const level = userDetails.level.level;
    const min = gameDefinition.minLevel;
    const max = gameDefinition.maxLevel;
    const canPlay = level >= min && (max == 0 || level <= max);
    return canPlay;
  }
}
