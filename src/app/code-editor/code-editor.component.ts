import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  @Input() script:string = "";

  constructor() { }

  ngOnInit() {
  }

}
