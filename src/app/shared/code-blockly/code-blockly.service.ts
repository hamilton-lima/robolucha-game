import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BlocklyService {

  readonly defaultToolbox = `
  <xml>
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

    <category name="Luchador" colour="260">
      <block type="me_string" />
      <block type="me_number" />
    </category>
    <sep></sep>

    <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}" />

    <category name="Math" colour="%{BKY_MATH_HUE}">
      <block type="math_number" />
      <block type="math_arithmetic" />
      <block type="math_single" />
      <block type="math_constant" />
      <block type="math_random_int" />
    </category>

    <category name="Control" colour="%{BKY_LOOPS_HUE}" >
      <block type="controls_if" />
      <block type="controls_ifelse"/>
      <block type="controls_whileUntil"/>
      <block type="controls_for"/>
      <block type="controls_forEach"/>
      <block type="controls_flow_statements"/>
    </category>

    <category name="Logic" colour="%{BKY_LOGIC_HUE}">
      <block type="logic_compare"/>
      <block type="logic_operation"/>
      <block type="logic_boolean"/>
      <block type="logic_negate"/>
    </category>
  </xml>`;

  readonly toolBoxWithOther = `
    <xml>
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

    <category name="Luchador" colour="260">
      <block type="me_string" />
      <block type="me_number" />
      <block type="other_string" />
      <block type="other_number" />

    </category>
    <sep></sep>

    <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}" />

    <category name="Math" colour="%{BKY_MATH_HUE}">
      <block type="math_number" />
      <block type="math_arithmetic" />
      <block type="math_single" />
      <block type="math_constant" />
      <block type="math_random_int" />
    </category>

    <category name="Control" colour="%{BKY_LOOPS_HUE}" >
      <block type="controls_if" />
      <block type="controls_ifelse"/>
      <block type="controls_whileUntil"/>
      <block type="controls_for"/>
      <block type="controls_forEach"/>
      <block type="controls_flow_statements"/>
    </category>

    <category name="Logic" colour="%{BKY_LOGIC_HUE}">
      <block type="logic_compare"/>
      <block type="logic_operation"/>
      <block type="logic_boolean"/>
      <block type="logic_negate"/>
    </category>
  </xml>`;

  getToolbox() {
    return this.defaultToolbox;
  }

  getToolboxWithOption() {
    return this.toolBoxWithOther;
  }
}
