// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { timer } from "rxjs";
import { BlocklyService } from "./code-blockly.service";

declare var Blockly: any;

@Component({
  selector: "app-code-blockly",
  templateUrl: "./code-blockly.component.html",
  styleUrls: ["./code-blockly.component.scss"],
})
export class CodeBlocklyComponent implements OnInit {
  workspace: any;

  @Input() eventId: string;
  @Output() codeChanged = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BlocklyService
  ) {}

  ngAfterViewInit(): void {
    timer(500).subscribe((done) => {
      const toolbox = this.service.defaultToolbox();
      this.declareCommands();
      this.workspace = Blockly.inject(this.eventId, { toolbox });
      this.workspace.addChangeListener(this.update.bind(this));
      this.defineVariables();
    });
  }

  ngOnInit() {}

  defineVariables() {
    this.workspace.createVariable("id");
    this.workspace.createVariable("name");
    this.workspace.createVariable("x");
    this.workspace.createVariable("y");
    this.workspace.createVariable("life");
    this.workspace.createVariable("angle");
    this.workspace.createVariable("gunAngle");
    this.workspace.createVariable("fireCooldown");
    this.workspace.createVariable("k");
    this.workspace.createVariable("d");
    this.workspace.createVariable("score");
  }

  declareCommands() {
    // debug	message	string
    Blockly.defineBlocksWithJsonArray([
      {
        // move	distance	number (greater than 0)
        type: "move",
        message0: "move %1",
        args0: [{ type: "input_value", name: "VALUE", check: "Number" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        // fire	strength	number (0 to 10)
        type: "fire",
        message0: "fire %1",
        args0: [{ type: "input_value", name: "VALUE", check: "Number" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        // turn	degrees	number (-360 to 360)
        type: "turn",
        message0: "turn %1",
        args0: [{ type: "input_value", name: "VALUE", check: "Number" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        //turnGun	degrees	number (-360 to 360)
        type: "turnGun",
        message0: "Turn gun %1",
        args0: [{ type: "input_value", name: "VALUE", check: "Number" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        // reset
        type: "reset",
        message0: "reset",
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        // debug	message	string
        type: "debug",
        message0: "debug %1",
        args0: [{ type: "input_value", name: "VALUE" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
    ]);

    Blockly.Lua["move"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `move(${value})\n`;
    };

    Blockly.Lua["fire"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `fire(${value})\n`;
    };

    Blockly.Lua["turn"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `turn(${value})\n`;
    };

    Blockly.Lua["turnGun"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `turnGun(${value})\n`;
    };

    Blockly.Lua["reset"] = function (block) {
      return `reset()\n`;
    };

    Blockly.Lua["debug"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `debug(${value})\n`;
    };
  }

  update(): void {
    const code = Blockly.Lua.workspaceToCode();
    console.log('code', code);
    this.codeChanged.next(code);
  }
}
