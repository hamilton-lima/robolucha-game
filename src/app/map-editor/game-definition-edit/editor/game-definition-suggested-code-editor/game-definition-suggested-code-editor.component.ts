import { Component, OnInit } from "@angular/core";
import { ModelCode } from "src/app/sdk";
import { CodeAcordionEventEditor } from "src/app/shared/code-accordion/code-accordion.component";
import { BlocklyConfig } from "src/app/shared/code-blockly/code-blockly.service";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-game-definition-suggested-code-editor",
  templateUrl: "./game-definition-suggested-code-editor.component.html",
  styleUrls: ["./game-definition-suggested-code-editor.component.scss"],
})
export class GameDefinitionSuggestedCodeEditorComponent implements OnInit {
  codes: ModelCode[];
  helpFile: string;
  editors: CodeAcordionEventEditor[];
  foo: BlocklyConfig

  constructor(private mediator: GameDefinitionEditMediatorService) {}

  ngOnInit() {
    this.helpFile = "help/server_code_editor_help";
    this.editors = [
      { event: "onRepeat", label: "On repeat", config: BlocklyConfig.Default },
      { event: "onStart", label: "On start", config: BlocklyConfig.Default },
      { event: "onHitWall", label: "On hit wall", config: BlocklyConfig.Default },
      { event: "onFound", label: "On found", config: BlocklyConfig.DefaultWithOther },
      { event: "onGotDamage", label: "On got damage", config: BlocklyConfig.DefaultWithOther },
      { event: "onHitOther", label: "On hit other", config: BlocklyConfig.DefaultWithOther },
    ];

    this.mediator.onEditGameDefinitionSuggestedCode.subscribe((codes) => {
      this.codes = codes;
    });
  }

  updateCode(codes: ModelCode[]) {
    this.mediator.onUpdateSuggestedCode.next(this.codes);
  }
}
