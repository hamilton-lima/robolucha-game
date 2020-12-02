import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ModelCode } from "src/app/sdk";
import { BlocklyConfig } from "../code-blockly/code-blockly.service";

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
  @Input() config: BlocklyConfig;

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
