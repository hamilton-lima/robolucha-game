import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CurrentEditorEnum } from './game-definition-edit.model';

@Injectable({
  providedIn: 'root'
})
export class GameDefinitionEditMediatorService {
  onEdit: Subject<CurrentEditorEnum> = new Subject();
  
  constructor() { }
}
