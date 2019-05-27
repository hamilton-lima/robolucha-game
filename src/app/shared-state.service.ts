import { Injectable } from "@angular/core";
import { MainMatch, MainGameDefinition } from "./sdk/model/models";
import { Subject } from "rxjs";
import { DefaultService } from "./sdk";

@Injectable({
  providedIn: "root"
})
export class SharedStateService {
  match: Subject<MainMatch> = new Subject();
  gameDefinition: Subject<MainGameDefinition> = new Subject();

  constructor(private api: DefaultService) {}

  setCurrentMatch(match: MainMatch): any {
    this.api
      .privateGameDefinitionIdIdGet(match.gameDefinitionID)
      .subscribe((gameDefinition: MainGameDefinition) => {
        console.log("gamedefinition from the server", gameDefinition);
        this.gameDefinition.next(gameDefinition);
        this.match.next(match);
      });
  }

}
