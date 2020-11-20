import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BlocklyService {
  defaultToolbox() {
    const toolbox = `
        <xml>
          <category name="Commands" expanded="true">
              <block type="move" />
              <block type="fire" />
              <block type="turn" />
              <block type="turnGun" />
              <block type="reset" />
              <block type="debug" />
              <block type="math_number"></block>
              <block type="math_arithmetic"></block>
          </category>
         
          <category name="Luchador">
             <block type="me_string" />
             <block type="me_number" />
          </category>
          <sep></sep>
  
          <category name="Variables" custom="VARIABLE"></category>

          <category name="Math">
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
            <block type="math_constant"></block>
            <block type="math_random_int"></block>
          </category>
  
          <category name="Control">
            <block type="controls_if"></block>
            <block type="controls_ifelse"></block>
            <block type="controls_whileUntil"></block>
            <block type="controls_for"></block>
            <block type="controls_forEach"></block>
            <block type="controls_flow_statements"></block>
          </category>
  
          <category name="Logic">
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_boolean"></block>
            <block type="logic_negate"></block>
          </category>
        </xml>`;

    return toolbox;
  }
}
