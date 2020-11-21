// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  @Input() useOther: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BlocklyService
  ) {}

  ngAfterViewInit(): void {
    timer(500).subscribe((done) => {
      let toolbox;

      if( this.useOther){
        toolbox = this.service.getToolboxWithOption();
      } else {
        toolbox = this.service.getToolbox();
      }

      this.declareCommands();
      this.workspace = Blockly.inject(this.eventId, { toolbox });
      this.workspace.addChangeListener(this.update.bind(this));

    });
  }

  ngOnInit() {}

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
        message0: "turn gun %1",
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
        args0: [{ type: "input_value", name: "VALUE", check: "String" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        type: "me_string",
        message0: "me.%1",
        output: "String",
        colour: 290,
        args0: [
          {
            type: "field_dropdown",
            name: "ME_STRING_FIELD",
            options: [
              ["all", ""],
              ["id", ".id"],
              ["name", ".name"],
            ],
          },
        ],
      },
      {
        type: "me_number",
        message0: "me.%1",
        output: "Number",
        colour: 260,
        args0: [
          {
            type: "field_dropdown",
            name: "ME_NUMBER_FIELD",
            options: [
              ["x", ".x"],
              ["y", ".y"],
              ["life", ".life"],
              ["angle", ".angle"],
              ["gunAngle", ".gunAngle"],
              ["fireCooldown", ".fireCooldown"],
              ["fireCooldown", ".fireCooldown"],
              ["kills", ".k"],
              ["deaths", ".d"],
              ["score", ".score"],
            ],
          },
        ],
      },
      {
        type: "other_string",
        message0: "other.%1",
        output: "String",
        colour: 290,
        args0: [
          {
            type: "field_dropdown",
            name: "OTHER_STRING_FIELD",
            options: [
              ["all", ""],
              ["id", ".id"],
              ["name", ".name"],
            ],
          },
        ],
      },
      {
        type: "other_number",
        message0: "other.%1",
        output: "Number",
        colour: 260,
        args0: [
          {
            type: "field_dropdown",
            name: "OTHER_NUMBER_FIELD",
            options: [
              ["x", ".x"],
              ["y", ".y"],
              ["life", ".life"],
              ["angle", ".angle"],
              ["gunAngle", ".gunAngle"],
              ["fireCooldown", ".fireCooldown"],
              ["fireCooldown", ".fireCooldown"],
              ["kills", ".k"],
              ["deaths", ".d"],
              ["score", ".score"],
            ],
          },
        ],
      },
    ]);

    Blockly.Lua["me_string"] = function (block) {
      const field = block.getFieldValue("ME_STRING_FIELD");
      const result = `me${field}`;
      return [result, Blockly.Lua.ORDER_ATOMIC];
    };

    Blockly.Lua["me_number"] = function (block) {
      const field = block.getFieldValue("ME_NUMBER_FIELD");
      const result = `me${field}`;
      return [result, Blockly.Lua.ORDER_ATOMIC];
    };

    Blockly.Lua["other_string"] = function (block) {
      const field = block.getFieldValue("OTHER_STRING_FIELD");
      const result = `other${field}`;
      return [result, Blockly.Lua.ORDER_ATOMIC];
    };

    Blockly.Lua["other_number"] = function (block) {
      const field = block.getFieldValue("OTHER_NUMBER_FIELD");
      const result = `other${field}`;
      return [result, Blockly.Lua.ORDER_ATOMIC];
    };

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
    this.codeChanged.next(code);
  }
}
