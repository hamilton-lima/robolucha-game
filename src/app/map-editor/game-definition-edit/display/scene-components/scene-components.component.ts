import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { ModelGameDefinition, ModelSceneComponent } from "src/app/sdk";
import { SceneComponentBuilderService } from "./scene-component-builder.service";

@Component({
  selector: "app-scene-components",
  templateUrl: "./scene-components.component.html",
  styleUrls: ["./scene-components.component.scss"],
})
export class SceneComponentsComponent implements OnInit {
  @Input() components: ModelSceneComponent[];

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private builder: SceneComponentBuilderService
  ) {}
  ngOnInit() {}

  edit(sceneComponent: ModelSceneComponent) {
    this.mediator.onEditSceneComponent.next(sceneComponent);
  }

  add() {
    if (this.components) {
      this.components.unshift(this.builder.build());
      this.mediator.onUpdateSceneComponents.next(this.components);
    }
  }

  delete(i){
    if (this.components) {
      this.components.splice(i,1);
      this.mediator.onUpdateSceneComponents.next(this.components);
    }
  }
}
