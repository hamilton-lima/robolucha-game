import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "src/app/map-editor/game-definition-edit/game-definition-edit.model";
import { MapEditorService } from "src/app/map-editor/map-editor.service";
import { ModelGameDefinition } from "src/app/sdk";

@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
})
export class BasicInfoComponent {
  @Input() gameDefinition: ModelGameDefinition;

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private service: MapEditorService
  ) {}

  nextLabel(){
    return this.service.getGameDefinitionLabel(
      this.gameDefinition.nextGamedefinitionID
    );
  }

  edit() {
    this.mediator.onEditBasicInfo.next(this.gameDefinition);
  }
}
