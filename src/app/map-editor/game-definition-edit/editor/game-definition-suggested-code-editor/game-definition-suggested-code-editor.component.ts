import { Component, Input, OnInit } from "@angular/core";
import { ModelCode } from "src/app/sdk";
import { BlocklyConfig } from "src/app/shared/code-blockly/code-blockly.service";
import { CodeEditorEvent } from "src/app/shared/code-editor/code-editor.component";
import { CodeEditorService } from "src/app/shared/code-editor/code-editor.service";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-game-definition-suggested-code-editor",
  templateUrl: "./game-definition-suggested-code-editor.component.html",
  styleUrls: ["./game-definition-suggested-code-editor.component.scss"],
})
export class GameDefinitionSuggestedCodeEditorComponent implements OnInit {
  @Input() gameDefinitionID;
  
  code: ModelCode;
  config = BlocklyConfig.DefaultWithOther;

  constructor(
    private mediator: GameDefinitionEditMediatorService,
    private service: CodeEditorService
  ) {}

  ngOnInit() {
    this.mediator.onEditGameDefinitionSuggestedCode.subscribe((codes) => {
      this.code = this.service.getCode(codes, this.gameDefinitionID);
    });
  }

  updateCode(event: CodeEditorEvent) {
    this.code.blockly = event.blocklyDefinition;
    this.code.script = event.code;
    this.mediator.onUpdateSuggestedCode.next([this.code]);
  }

}
