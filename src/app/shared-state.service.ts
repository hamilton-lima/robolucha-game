import { Injectable } from "@angular/core";
import { ModelMatch, ModelGameDefinition } from "./sdk/model/models";
import { Subject } from "rxjs";
import { DefaultService } from "./sdk";

@Injectable({
  providedIn: "root"
})
export class SharedStateService {
  match: Subject<ModelMatch> = new Subject();
  gameDefinition: Subject<ModelGameDefinition> = new Subject();

  constructor(private api: DefaultService) {}

  setCurrentMatch(match: ModelMatch): any {
    this.api
      .privateGameDefinitionIdIdGet(match.gameDefinitionID)
      .subscribe((gameDefinition: ModelGameDefinition) => {
        console.log("gamedefinition from the server", gameDefinition);
        this.gameDefinition.next(gameDefinition);
        this.match.next(match);
      });
  }

}
