import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var Blockly: any;

@Component({
  selector: 'app-code-blockly',
  templateUrl: './code-blockly.component.html',
  styleUrls: ['./code-blockly.component.scss']
})
export class CodeBlocklyComponent implements OnInit {

  title: string;
  code: string;
  workspace: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.title = 'Create Visual Program';
  }

  ngAfterViewInit(): void {
    const toolbox = `
      <xml>
        <block type="controls_if"></block>
        <block type="controls_whileUntil"></block>
      </xml>`;
    Blockly.inject('blocklyDiv', { toolbox });
  }

  ngOnInit() {
    // this.workspace = Blockly.inject('blocklyDiv', {
    //   toolbox: document.getElementById('toolbox'),
    //   scrollbars: false
    // });

    // if (this.program.xmlData) {
    //   this.workspace.clear();
    //   Blockly.Xml.domToWorkspace(
    //     Blockly.Xml.textToDom(this.program.xmlData),
    //     this.workspace
    //   );
    // }
  }

  saveProgram(): void {
    // this.program.xmlData = Blockly.Xml.domToText(
    //   Blockly.Xml.workspaceToDom(this.workspace)
    // );
    // console.log('saving the program - ', JSON.stringify(this.program));
    // this.programService.upsertOne(this.program);
    // this.router.navigate(['listProgram']);
  }
}
