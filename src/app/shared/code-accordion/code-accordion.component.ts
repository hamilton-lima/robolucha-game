import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/shared/message/message.model';
import { ModelCode } from 'src/app/sdk';
import { CodeEditorEvent } from '../code-editor/code-editor.component';
import { BlocklyConfig } from '../code-blockly/code-blockly.service';

export class CodeAcordionEventEditor {
  label: string;
  event: string;
  config: BlocklyConfig
}

@Component({
  selector: 'app-code-accordion',
  templateUrl: './code-accordion.component.html',
  styleUrls: ['./code-accordion.component.scss'],
})
export class CodeAccordionComponent implements OnInit {
  @Input() codes: ModelCode[];
  @Input() editors: CodeAcordionEventEditor[];
  @Input() helpFile: string;
  @Input() messageSubject: Subject<Message>;

  @Output() update: EventEmitter<ModelCode[]> = new EventEmitter();

  dirty = false;

  constructor() {
    this.codes = [];
    this.helpFile = 'help/code_editor_help';
  }

  ngOnInit() {
    if (!this.codes) {
      this.codes = [];
    }
  }

  getCode(name: string) {
    const code = this.codes.find((code) => code.event == name);
    if (code) {
      return code;
    }
    return  null;
  }

  updateCode(event: string, value: CodeEditorEvent) {
    const search = this.codes.find((code) => code.event == event);

    if (search) {
      search.script = value.code;
      search.blockly = value.blocklyDefinition;
    } else {
      this.codes.push(<ModelCode>{
        event: event,
        script: value.code,
        blockly: value.blocklyDefinition,
      });
    }

    this.update.emit(this.codes);
  }

  isExpanded(i) {
    // expand first element by default
    return i == 0;
  }

}
