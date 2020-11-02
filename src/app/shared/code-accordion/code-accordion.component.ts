import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { Message } from "src/app/shared/message/message.model";
import { ModelCode } from "src/app/sdk";

export class CodeAcordionEventEditor {
  label: string;
  event: string;
}

@Component({
  selector: "app-code-accordion",
  templateUrl: "./code-accordion.component.html",
  styleUrls: ["./code-accordion.component.scss"],
})
export class CodeAccordionComponent implements OnInit {
  @Input() codes: ModelCode[];
  @Input() editors: CodeAcordionEventEditor[];
  @Input() helpFile: string;
  @Input() messageSubject: Subject<Message>;

  @Output() update: EventEmitter<ModelCode[]> = new EventEmitter();

  dirty: boolean = false;

  constructor() {
    this.codes = [];
    this.helpFile = "help/code_editor_help";
  }

  ngOnInit() {
    if (!this.codes) {
      this.codes = [];
    }
  }

  getScript(name: string) {
    const code = this.codes.find((code) => code.event == name);
    if (code) {
      return code.script;
    }
    return "";
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

    this.update.emit(this.codes);
  }

  isExpanded(i) {
    // expand first element by default
    return i == 0;
  }
}
