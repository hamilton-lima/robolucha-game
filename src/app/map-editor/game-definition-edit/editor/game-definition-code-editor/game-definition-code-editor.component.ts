import { Component, OnInit } from "@angular/core";
import { ModelCode } from "src/app/sdk";
import { GameDefinitionEditMediatorService } from "../../game-definition-edit-mediator.service";

@Component({
  selector: "app-game-definition-code-editor",
  templateUrl: "./game-definition-code-editor.component.html",
  styleUrls: ["./game-definition-code-editor.component.scss"],
})
export class GameDefinitionCodeEditorComponent implements OnInit {
  codes: ModelCode[];
  constructor(private mediator: GameDefinitionEditMediatorService) {}

  ngOnInit() {
    this.mediator.onEditGameDefinitionCode.subscribe((codes) => {
      this.codes = codes;
    });
  }

  getCode(event: string) {
    const search = this.codes.find((code) => code.event == event);

    if (search) {
      return search;
    }

    return <ModelCode>{
      event: event,
      script: "",
    };
  }

  updateCode(event: string, script: string) {
    console.log("udpate code ", event, script);
    const search = this.codes.find((code) => code.event == event);

    if (search) {
      search.script = script;
    } else {
      this.codes.push(<ModelCode>{
        event: event,
        script: script,
      });
    }

    this.mediator.onUpdateGameDefinitionCode.next(this.codes);
  }
}
