import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { MainCode } from "../sdk/model/mainCode";

import { MainUpdateLuchadorResponse } from "../sdk/model/mainUpdateLuchadorResponse";
import { ActivatedRoute } from "@angular/router";

import { DefaultService } from "../sdk/api/default.service";
import { MainLuchador } from "../sdk/model/mainLuchador";
import { MainGameDefinition } from "../sdk";

const HIDE_SUCCESS_TIMEOUT = 3000;

@Component({
  selector: "app-code-editor-panel",
  templateUrl: "./code-editor-panel.component.html",
  styleUrls: ["./code-editor-panel.component.css"]
})
export class CodeEditorPanelComponent implements OnInit, OnChanges {
  dirty: boolean = false;
  luchador: MainLuchador;
  luchadorResponse: MainUpdateLuchadorResponse;
  successMessage: string;

  @Input() gameDefinition: MainGameDefinition;

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private cdRef: ChangeDetectorRef
  ) {
    const data = this.route.snapshot.data;
    this.luchador = data.luchador;
  }

  codes = {
    onStart: <MainCode>{ event: "onStart" },
    onRepeat: <MainCode>{ event: "onRepeat" },
    onGotDamage: <MainCode>{ event: "onGotDamage" },
    onFound: <MainCode>{ event: "onFound" },
    onHitOther: <MainCode>{ event: "onHitOther" },
    onHitWall: <MainCode>{ event: "onHitWall" }
  };

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.luchador = data.luchador;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshEditor();
    this.cdRef.detectChanges();
  }

  /** Loads codes from luchador to the editor, filter by gameDefinition */
  refreshEditor() {
    if( !  this.gameDefinition){
      console.warn("gameDefinition not set in code-editor-panel");
      return;
    }
    
    let loadedCodes = 0;
    this.dirty = false;

    for (var event in this.codes) {
      // get codes from luchador for event + gamedefinition
      let code = this.luchador.codes.find((code: MainCode) => {
        return (
          code.event == event && code.gameDefinition == this.gameDefinition.id
        );
      });

      // if exists updates working codes
      if (code) {
        loadedCodes++;
        this.codes[event] = code;
      }
    }

    // no code found for current gamedefinition
    // apply suggested codes
    if (loadedCodes == 0) {
      for (var key in this.codes) {
        let suggestedCode = this.getCodeFromGameDefinition(key);
        this.codes[key] = suggestedCode;
      }

      this.dirty = true;
    }
  }

  // return suggested code from the current gamedefinition
  // if event not present in the list returns empy code
  getCodeFromGameDefinition(event: string): MainCode {
    let result: MainCode = this.gameDefinition.suggestedCodes.find(element => {
      return element.event == event;
    });

    if (!result) {
      result = <MainCode>{ event: event };
    }

    result.id = null;
    result.gameDefinition = this.gameDefinition.id;
    return result;
  }

  // update the internal list of codes from the editor 
  updateCode(event: string, script: string) {
    console.log("update code", event, script);
    this.dirty = true;
    this.codes[event].script = script;
  }

  save() {
    // apply the changes to the luchador object
    for (var event in this.codes) {
      // get codes from luchador for event + gamedefinition
      let code = this.luchador.codes.find((code: MainCode) => {
        return (
          code.event == event &&
          code.gameDefinition == this.codes[event].gameDefinition
        );
      });

      // if exists updates the luchador with working code
      if (code) {
        code.script = this.codes[event].script;
      }
    }

    this.api.privateLuchadorPut(this.luchador).subscribe(response => {
      this.successMessage = "Luchador updated";
      this.dirty = false;
      setTimeout(() => (this.successMessage = null), HIDE_SUCCESS_TIMEOUT);
      this.cdRef.detectChanges();
    });
  }
}
