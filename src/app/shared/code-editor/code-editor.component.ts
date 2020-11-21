import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ModelCode } from "src/app/sdk";

export interface CodeEditorEvent {
  code: string;
  blocklyDefinition?: string;
}

@Component({
  selector: "app-code-editor",
  templateUrl: "./code-editor.component.html",
  styleUrls: ["./code-editor.component.css"],
})
export class CodeEditorComponent implements OnInit {
  @Input() useOther = false;

  _code: ModelCode;
  get code(): ModelCode {
    return this._code;
  }

  @Input() set code(value: ModelCode) {
    if (value) {
      this._code = value;
    } else {
      this._code = <ModelCode>{};
    }
  }

  @Output() onChange = new EventEmitter<CodeEditorEvent>();
  constructor() {}

  ngOnInit() {}

  onEditorChange(event) {
    this.onChange.next(event);
  }
}
