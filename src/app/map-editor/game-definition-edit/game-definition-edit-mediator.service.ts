import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import {
  ModelCode,
  ModelGameDefinition,
  ModelSceneComponent,
} from "src/app/sdk";
import { MatchState } from "src/app/watch-match/watch-match.model";
import { PartialModelGameDefinition } from "./game-definition-edit.model";

@Injectable({
  providedIn: "root",
})
export class GameDefinitionEditMediatorService {
  onEditBasicInfo: Subject<ModelGameDefinition> = new BehaviorSubject(null);
  onEditGameDefinitionCode: Subject<ModelCode[]> = new BehaviorSubject(null);
  onEditGameDefinitionSuggestedCode: Subject<ModelCode[]> = new BehaviorSubject(null);
  onEditSceneComponent: Subject<ModelSceneComponent> = new BehaviorSubject(
    null
  );

  onUpdateBasicInfo: Subject<PartialModelGameDefinition> = new Subject();
  onUpdateSceneComponents: Subject<ModelSceneComponent[]> = new Subject();
  onUpdateGameDefinitionCode: Subject<ModelCode[]> = new Subject();
  onUpdateSuggestedCode: Subject<ModelCode[]> = new Subject();

  constructor() {}
}
