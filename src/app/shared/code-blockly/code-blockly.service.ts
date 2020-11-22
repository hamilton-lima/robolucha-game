import { Injectable } from "@angular/core";

declare var Blockly: any;

@Injectable({
  providedIn: "root",
})
export class BlocklyService {
  constructor() {
    this.setup();
  }

  readonly emptyXML =
    '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';

  inject(id: string, useOther: boolean, onChange: any) {
    let toolbox;

    if (useOther) {
      toolbox = this.getToolboxWithOption();
    } else {
      toolbox = this.getToolboxDefault();
    }

    const blocklyDiv = document.getElementById(id);
    const workspace = Blockly.inject(blocklyDiv, { toolbox: toolbox });

    workspace.addChangeListener(onChange);
    return workspace;
  }

  setXML(xml: string, workspace: any) {
    if (xml) {
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } else {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(this.emptyXML),
        workspace
      );
    }
  }

  getXML(workspace) {
    const dom = Blockly.Xml.workspaceToDom(workspace);
    const xml = Blockly.Xml.domToText(dom);
    return xml;
  }

  getCode(workspace) {
    const code = Blockly.Lua.workspaceToCode(workspace);
    return code;
  }

  readonly commands = `
  <category name="Commands" colour="%{BKY_PROCEDURES_HUE}">
      <block type="move" />
      <block type="fire" />
      <block type="turn" />
      <block type="turnGun" />
      <block type="reset" />
      <block type="debug" />
      <block type="math_number" />
      <block type="math_arithmetic" />
  </category>
  `;

  readonly luchador = `
  <category name="Luchador" colour="260">
    <block type="me_string" />
    <block type="me_number" />
  </category>
  `;

  readonly luchadorWithOther = `
  <category name="Luchador" colour="260">
    <block type="me_string" />
    <block type="me_number" />
    <block type="other_string" />
    <block type="other_number" />
  </category>
  `;

  readonly separator = `
  <sep></sep>
  `;

  readonly variables = `
  <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}" />
  `;

  readonly math = `
  <category name="Math" colour="%{BKY_MATH_HUE}">
    <block type="math_number" />
    <block type="math_arithmetic" />
    <block type="math_single" />
    <block type="math_constant" />
    <block type="math_random_int" />
  </category>
  `;

  readonly control = `
  <category name="Control" colour="%{BKY_LOOPS_HUE}" >
    <block type="controls_if" />
    <block type="controls_ifelse"/>
    <block type="controls_whileUntil"/>
    <block type="controls_for"/>
    <block type="controls_forEach"/>
    <block type="controls_flow_statements"/>
  </category>
  `;

  readonly logic = `
  <category name="Logic" colour="%{BKY_LOGIC_HUE}">
    <block type="logic_compare"/>
    <block type="logic_operation"/>
    <block type="logic_boolean"/>
    <block type="logic_negate"/>
  </category>
  `;

  readonly toolboxDefault = [
    this.commands,
    this.luchador,
    this.separator,
    this.variables,
    this.math,
    this.control,
    this.logic,
  ];

  readonly toolboxWithOther = [
    this.commands,
    this.luchadorWithOther,
    this.separator,
    this.variables,
    this.math,
    this.control,
    this.logic,
  ];

  getToolboxXML(data: string[]) {
    const xml = data.join("\n");
    const result = `<xml>${xml}</xml>`;
    return result;
  }

  getToolboxWithOption() {
    return this.getToolboxXML(this.toolboxWithOther);
  }

  getToolboxDefault() {
    return this.getToolboxXML(this.toolboxDefault);
  }

  setup() {
    // debug	message	string
    Blockly.defineBlocksWithJsonArray([
      {
        // move	distance	number (greater than 0)
        type: "move",
        message0: "move %1",
        args0: [{ type: "input_value", name: "MOVE_VALUE", check: "Number" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        // fire	strength	number (0 to 10)
        type: "fire",
        message0: "fire %1",
        args0: [{ type: "input_value", name: "FIRE_VALUE", check: "Number" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        // turn	degrees	number (-360 to 360)
        type: "turn",
        message0: "turn %1",
        args0: [{ type: "input_value", name: "TURN_VALUE", check: "Number" }],
        previousStatement: null,
        nextStatement: null,
        colour: 355,
      },
      {
        //turnGun	degrees	number (-360 to 360)
        type: "turnGun",
        message0: "turn gun %1",
        args0: [{ type: "input_value", name: "TURNGUN_VALUE", check: "Number" }],
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
        args0: [{ type: "input_value", name: "DEBUG_VALUE", check: "String" }],
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
        "MOVE_VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `move(${value})\n`;
    };

    Blockly.Lua["fire"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "FIRE_VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `fire(${value})\n`;
    };

    Blockly.Lua["turn"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "TURN_VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `turn(${value})\n`;
    };

    Blockly.Lua["turnGun"] = function (block) {
      const value = Blockly.Lua.valueToCode(
        block,
        "TURNGUN_VALUE",
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
        "DEBUG_VALUE",
        Blockly.Lua.ORDER_ATOMIC
      );
      return `debug(${value})\n`;
    };
  }
}
