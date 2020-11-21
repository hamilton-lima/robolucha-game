import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { DefaultService } from "./sdk/api/default.service";
import { Observable, Subject } from "rxjs";
import { ModelGameDefinition } from "./sdk";

@Injectable({
  providedIn: "root",
})
export class GameDefinitionFromMatchIDResolverService
  implements Resolve<ModelGameDefinition> {
  constructor(private api: DefaultService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ModelGameDefinition> {

    const result = new Subject<ModelGameDefinition>();
    const matchID = Number.parseInt(route.paramMap.get("id"));

    this.api.privateMatchSingleGet(matchID).subscribe((match) => {
      return this.api
        .privateGameDefinitionIdIdGet(match.gameDefinitionID)
        .subscribe((gameDefinition) => {
          result.next(gameDefinition);
          result.complete();
        });
    });

    return result;
  }
}
