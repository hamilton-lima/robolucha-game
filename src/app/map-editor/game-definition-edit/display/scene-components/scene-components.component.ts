import { Component, OnInit } from '@angular/core';
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "src/app/map-editor/game-definition-edit/game-definition-edit.model";

@Component({
  selector: 'app-scene-components',
  templateUrl: './scene-components.component.html',
  styleUrls: ['./scene-components.component.scss']
})
export class SceneComponentsComponent implements OnInit {

  constructor(private mediator: GameDefinitionEditMediatorService) {}
  ngOnInit() {}

  edit() {
    this.mediator.onEdit.next(CurrentEditorEnum.SingleSceneComponent);
  }
}
