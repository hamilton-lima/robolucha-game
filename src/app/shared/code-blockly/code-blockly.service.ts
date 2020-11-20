import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BlocklyService {
  defaultToolbox() {
    const toolbox = `
        <xml>
          <category name="Commands" colour="%{BKY_PROCEDURES_HUE}">
              <block type="math_number" />
              <block type="move" />
              <block type="fire" />
              <block type="turn" />
              <block type="turnGun" />
              <block type="reset" />
              <block type="debug" />
          </category>

          <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}" />
          <sep />

          <category name="Math" colour="%{BKY_MATH_HUE}">
            <block type="math_number"/>
            <block type="math_arithmetic" />
            <block type="math_single" />
            <block type="math_constant" />
            <block type="math_random_int" />
          </category>

          <category name="Control" colour="%{BKY_LOOPS_HUE}">
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

    return toolbox;
  }
}
