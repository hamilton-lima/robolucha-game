import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/mode/lua';

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

  @Input() script = '';
  @Input() eventId: string;
  @Input() showBlockly = false;

  @Output() onChange = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  onEditorChange(event) {
    this.onChange.next( event );
  }

  toggle() {
    this.showBlockly = !this.showBlockly;
  }

}
