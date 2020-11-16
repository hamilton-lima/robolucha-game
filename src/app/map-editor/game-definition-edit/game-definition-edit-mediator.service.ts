import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import {
  ModelCode,
  ModelGameComponent,
  ModelGameDefinition,
  ModelNarrativeDefinition,
  ModelSceneComponent,
} from "src/app/sdk";
import { PartialModelGameDefinition } from "./game-definition-edit.model";

@Injectable({
  providedIn: "root",
})
export class GameDefinitionEditMediatorService {
  onEditBasicInfo: Subject<ModelGameDefinition> = new BehaviorSubject(null);
  onEditGameDefinitionCode: Subject<ModelCode[]> = new BehaviorSubject(null);
  onEditGameDefinitionSuggestedCode: Subject<ModelCode[]> = new BehaviorSubject(
    null
  );
  onEditSceneComponent: Subject<ModelSceneComponent> = new BehaviorSubject(
    null
  );
  onEditGameComponent: Subject<ModelGameComponent> = new BehaviorSubject(null);
  onEditNarrative: Subject<ModelNarrativeDefinition> = new BehaviorSubject(
    null
  );

  onUpdateBasicInfo: Subject<PartialModelGameDefinition> = new Subject();
  onUpdateSceneComponents: Subject<ModelSceneComponent[]> = new Subject();
  onUpdateSceneComponent: Subject<ModelSceneComponent> = new Subject();

  onUpdateGameDefinitionCode: Subject<ModelCode[]> = new Subject();
  onUpdateSuggestedCode: Subject<ModelCode[]> = new Subject();

  onUpdateGameComponents: Subject<ModelGameComponent[]> = new Subject();
  onUpdateGameComponent: Subject<ModelGameComponent> = new Subject();

  onUpdateNarrative: Subject<ModelNarrativeDefinition> = new Subject();
  onUpdateNarrativeDefinitions: Subject<
    ModelNarrativeDefinition[]
  > = new Subject();

  constructor() {}
}
