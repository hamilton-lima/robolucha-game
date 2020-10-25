import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { ModelGameDefinition } from "src/app/sdk";

@Component({
  selector: "app-game-definition-code",
  templateUrl: "./game-definition-code.component.html",
  styleUrls: ["./game-definition-code.component.scss"],
})
export class GameDefinitionCodeComponent implements OnInit {
  @Input() gameDefinition: ModelGameDefinition;

  constructor(private mediator: GameDefinitionEditMediatorService) {}
  ngOnInit() {}

  edit() {
    this.mediator.onEditGameDefinitionCode.next(this.gameDefinition.codes);
  }
}
