import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { ModelCode, ModelGameDefinition } from "src/app/sdk";

@Component({
  selector: "app-game-definition-code",
  templateUrl: "./game-definition-code.component.html",
  styleUrls: ["./game-definition-code.component.scss"],
})
export class GameDefinitionCodeComponent implements OnInit {
  @Input() gameDefinition: ModelGameDefinition;

  constructor(private mediator: GameDefinitionEditMediatorService) {}
  ngOnInit() {}

  editGame() {
    this.mediator.onEditGameDefinitionCode.next(this.gameDefinition.codes);
  }

  editSuggested() {
    this.mediator.onEditGameDefinitionSuggestedCode.next(
      this.gameDefinition.suggestedCodes
    );
  }

  showGameCode() {
    return this.formatCodes(this.gameDefinition.codes);
  }

  showSuggestedCode() {
    return this.formatCodes(this.gameDefinition.suggestedCodes);
  }

  formatCodes(codes: ModelCode[]) {
    let result = [];
    codes.forEach((code) => {
      if (code && code.script) {
        result.push(code.event);
      }
    });
    return result;
  }
}
