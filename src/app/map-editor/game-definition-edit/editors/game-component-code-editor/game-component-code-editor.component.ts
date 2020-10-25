import { Component, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { Message } from "src/app/message/message.model";
import { ModelCode } from "src/app/sdk";

@Component({
  selector: "app-game-component-code-editor",
  templateUrl: "./game-component-code-editor.component.html",
  styleUrls: ["./game-component-code-editor.component.scss"],
})
export class GameComponentCodeEditorComponent implements OnInit {
  @Input() codes: ModelCode[];
  @Input() messageSubject: Subject<Message>;

  constructor() {
    this.codes = [];
  }

  ngOnInit() {}

  getScript(name : string){
    const code = this.codes.find( code => code.event == name);
    if( code ){
      return code.script;
    } 
    return '';
  }
}
