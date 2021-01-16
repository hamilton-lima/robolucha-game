import { Component, Input, OnInit } from "@angular/core";
import { GameDefinitionEditMediatorService } from "src/app/map-editor/game-definition-edit/game-definition-edit-mediator.service";
import { ModelCode, ModelGameDefinition } from "src/app/sdk";
import { CodeEditorService } from "src/app/shared/code-editor/code-editor.service";

@Component({
  selector: "app-game-definition-code",
  templateUrl: "./game-definition-code.component.html",
  styleUrls: ["./game-definition-code.component.scss"],
})
export class GameDefinitionCodeComponent implements OnInit {
  @Input() gameDefinition: ModelGameDefinition;

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private service: CodeEditorService
  ) {}
  ngOnInit() {}

  editSuggested() {
    this.mediator.onEditGameDefinitionSuggestedCode.next(
      this.gameDefinition.suggestedCodes
    );
  }

  getScript() {
    const code = this.service.getCode(this.gameDefinition.suggestedCodes);
    return code.script;
  }
}
