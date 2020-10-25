import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ModelCode, ModelGameDefinition, ModelSceneComponent } from 'src/app/sdk';
import { CurrentEditorEnum } from './game-definition-edit.model';

@Injectable({
  providedIn: 'root'
})
export class GameDefinitionEditMediatorService {
  onEditBasicInfo: Subject<ModelGameDefinition> = new BehaviorSubject(null);
  onEditGameDefinitionCode: Subject<ModelCode[]> = new BehaviorSubject(null);
  onEditSceneComponent: Subject<ModelSceneComponent> = new BehaviorSubject(null);
  
  constructor() { }
}
