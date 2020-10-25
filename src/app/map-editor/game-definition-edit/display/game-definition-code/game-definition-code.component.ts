import { Component, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { CurrentEditorEnum } from "src/app/map-editor/game-definition-edit/game-definition-edit.model";

@Component({
  selector: "app-game-definition-code",
  templateUrl: "./game-definition-code.component.html",
  styleUrls: ["./game-definition-code.component.scss"],
})
export class GameDefinitionCodeComponent implements OnInit {
  constructor(private mediator: GameDefinitionEditMediatorService) {}
  ngOnInit() {}

  edit() {
    this.mediator.onEdit.next(CurrentEditorEnum.Codes);
  }
}
