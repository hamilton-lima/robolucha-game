import { Component, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { Message } from "src/app/shared/message/message.model";
import { ModelCode } from "src/app/sdk";

@Component({
  selector: "app-code-accordion",
  templateUrl: "./code-accordion.component.html",
  styleUrls: ["./code-accordion.component.scss"],
})
export class CodeAccordionComponent implements OnInit {
  @Input() codes: ModelCode[];
  @Input() helpFile: string;
  @Input() messageSubject: Subject<Message>;

  dirty: boolean = false;

  constructor() {
    this.codes = [];
    this.helpFile = "help/code_editor_help";
  }

  ngOnInit() {}

  getScript(name: string) {
    const code = this.codes.find((code) => code.event == name);
    if (code) {
      return code.script;
    }
    return "";
  }

  // update the internal list of codes from the editor
  updateCode(event: string, script: string) {
    this.dirty = true;
    this.codes[event].script = script;
  }
}
