import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "src/app/map-editor/game-definition-edit/game-definition-edit.model";
import { ModelGameDefinition } from "src/app/sdk";

@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
})
export class BasicInfoComponent implements OnInit {
  @Input() gameDefinition: ModelGameDefinition;

  constructor(private mediator: GameDefinitionEditMediatorService) {}
  ngOnInit() {}

  edit(){
    this.mediator.onEdit.next(CurrentEditorEnum.BasicInfo);
  }
}
