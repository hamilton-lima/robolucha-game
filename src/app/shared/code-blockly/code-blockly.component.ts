import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { timer } from "rxjs";
import { BlocklyService } from "./code-blockly.service";
import { CodeEditorEvent } from "../code-editor/code-editor.component";

@Component({
  selector: "app-code-blockly",
  templateUrl: "./code-blockly.component.html",
  styleUrls: ["./code-blockly.component.scss"],
})
export class CodeBlocklyComponent implements OnInit {
  workspace: any;
  code: string;

  // generate unique ID for each component
  static nextId = 0;
  id = `blockly-${CodeBlocklyComponent.nextId++}`;

  @Input() blocklyDefinition: string;
  @Input() useOther = false;
  @Output() codeChanged = new EventEmitter<CodeEditorEvent>();

  constructor(private service: BlocklyService) {}

  // ngOnDestroy(): void {
  //   console.log('destroy ', this.id, this.workspace);
  //   // releases blockly from memory
  //   if (this.workspace) {
  //     this.workspace.dispose();
  //   }
  // }

  ngAfterViewInit(): void {
    timer(500).subscribe((done) => {
      this.workspace = this.service.inject(
        this.id,
        this.useOther,
        this.update.bind(this)
      );
      this.service.setXML(this.blocklyDefinition, this.workspace);
    });
  }

  ngOnInit() {}

  update(): void {
    this.code = this.service.getCode(this.workspace);
    const blocklyDefinition = this.service.getXML(this.workspace);

    this.codeChanged.next({
      code: this.code,
      blocklyDefinition,
    } as CodeEditorEvent);
  }
}
