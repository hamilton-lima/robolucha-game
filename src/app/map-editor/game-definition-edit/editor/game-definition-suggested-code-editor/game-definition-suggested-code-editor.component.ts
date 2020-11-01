import { Component, OnInit } from "@angular/core";
import { ModelCode } from "src/app/sdk";
import { CodeAcordionEventEditor } from "src/app/shared/code-accordion/code-accordion.component";
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

  constructor(private mediator: GameDefinitionEditMediatorService) {}

  ngOnInit() {
    this.helpFile = "help/server_code_editor_help";
    this.editors = [
      { event: "onRepeat", label: "On repeat" },
      { event: "onStart", label: "On start" },
      { event: "onHitWall", label: "On hit wall" },
      { event: "onFound", label: "On found" },
      { event: "onGotDamage", label: "On got damage" },
      { event: "onHitOther", label: "On hit other" },
    ];

    this.mediator.onEditGameDefinitionSuggestedCode.subscribe((codes) => {
      this.codes = codes;
    });
  }

  updateCode(codes: ModelCode[]) {
    this.mediator.onUpdateSuggestedCode.next(this.codes);
  }
}
