import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/mode/lua';
import {ModelCode} from '../../sdk';

export interface CodeEditorEvent {
  code: string;
  blocklyDefinition?: string;
}

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})

export class CodeEditorComponent implements OnInit {
  options: any = {
    maxLines: 15,
    minLines: 15,
    printMargin: false,
    fontSize: 20
  };

  @Input() code: ModelCode;
  @Input() eventId: string;
  @Input() showBlockly = false;
  @Input() useOther = false;

  @Output() onChange = new EventEmitter<CodeEditorEvent>();
  constructor() {}

  ngOnInit() {}

  onEditorChange(event) {
    this.onChange.next( event );
  }

  toggle() {
    this.showBlockly = !this.showBlockly;
  }

}
