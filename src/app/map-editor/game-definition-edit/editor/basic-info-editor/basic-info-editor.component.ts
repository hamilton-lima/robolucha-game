import { Component, OnInit } from "@angular/core";
import { ModelGameDefinition } from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "../../game-definition-edit.model";

@Component({
  selector: "app-basic-info-editor",
  templateUrl: "./basic-info-editor.component.html",
  styleUrls: ["./basic-info-editor.component.scss"],
})
export class BasicInfoEditorComponent implements OnInit {
  gameDefinition: ModelGameDefinition;

  constructor(private mediator: GameDefinitionEditMediatorService) {
  }

  ngOnInit() {
    this.mediator.onEditBasicInfo.subscribe((gameDefinition) => {
      this.gameDefinition = gameDefinition;
    });
  }
}
