import { Component, Input, OnInit } from '@angular/core';
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { ModelGameDefinition, ModelSceneComponent } from 'src/app/sdk';

@Component({
  selector: 'app-scene-components',
  templateUrl: './scene-components.component.html',
  styleUrls: ['./scene-components.component.scss']
})
export class SceneComponentsComponent implements OnInit {
  @Input() gameDefinition: ModelGameDefinition;

  constructor(private mediator: GameDefinitionEditMediatorService) {}
  ngOnInit() {}

  edit(sceneComponent: ModelSceneComponent) {
    this.mediator.onEditSceneComponent.next(sceneComponent);
  }
}
