import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import "brace/theme/solarized_dark";
import "brace/mode/lua";

@Component({
  selector: "app-code-editor",
  templateUrl: "./code-editor.component.html",
  styleUrls: ["./code-editor.component.css"]
})
export class CodeEditorComponent implements OnInit {
  options: any = {
    maxLines: 15,
    minLines: 15,
    printMargin: false,
    fontSize: 20
  };

  @Input() script: string = "";
  @Output() onChange = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  onEditorChange(event) {
    console.log("onchange", event);
    this.onChange.next( event );
  }
}
