import { Component, OnInit, ChangeDetectorRef, Input, SimpleChanges, OnChanges } from "@angular/core";
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
export class CodeEditorPanelComponent implements OnInit, OnChanges  {
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
    onStart: <MainCode>{},
    onRepeat: <MainCode>{},
    onGotDamage: <MainCode>{},
    onFound: <MainCode>{},
    onHitOther: <MainCode>{},
    onHitWall: <MainCode>{}
  };

  ngOnInit() {
    const data = this.route.snapshot.data;
    // this.dirty = false;
    this.resetEditor();
    this.refreshEditor(data.luchador);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("gamedefinition", changes['gameDefinition'].currentValue);
    console.log("ngOnChanges luchador", this.luchador );
    this.refreshEditor(this.luchador);
    this.applysuggestedCode();
  }

  applysuggestedCode() {
    const found = this.luchador.codes.find(element => {
      return element.gameDefinition == this.gameDefinition.id;
    });

    if (!found) {
      this.resetEditor();
      this.dirty = true;

      for (var key in this.codes) {
        let suggestedCode = this.getCodeFromGameDefinition(key);
        this.codes[key] = suggestedCode;
      }
      
      this.luchador.codes = [];
      for (var key in this.codes) {
        this.luchador.codes.push(this.codes[key]);
      }
    }

  }

  getCodeFromGameDefinition(event: string): MainCode {
    let result: MainCode = this.gameDefinition.suggestedCodes.find(element => {
      return element.event == event;
    });

    if (!result) {
      result = <MainCode>{ event: event};
    }

    result.id = null;
    result.gameDefinition = this.gameDefinition.id;
    return result;
  }

  getCode(event: string): MainCode {
    let result = this.findCodeByEventName(event);

    if (!result) {
      result = <MainCode>{ event: event};
    }

    return result;
  }

  findCodeByEventName(event: string) {
    return this.luchador.codes.find((code: MainCode) => {
      if (code.event == event 
        && code.gameDefinition == this.gameDefinition.id) {
        return true;
      }
      return false;
    });
  }

  updateCode(event: string, script: string) {
    console.log("updateCode", event, script);
    this.dirty = true;

    let code = this.findCodeByEventName(event);

    if (code) {
      code.script = script;
    } else {
      code = <MainCode>{ event: event, script: script };
      this.luchador.codes.push(code);
    }

    this.codes[event] = code;
  }

  resetEditor(){
    for (var key in this.codes) {
      this.codes[key] = <MainCode>{};
    }
  }

  refreshEditor(luchador) {
    console.log("refresh luchador", luchador);
    this.luchador = luchador;
    for (var key in this.codes) {
      this.codes[key] = this.getCode(key);
    }
    this.applysuggestedCode();
  }

  save() {
    const remoteCall = this.api.privateLuchadorPut(this.luchador);

    remoteCall.subscribe(response => {
      this.successMessage = "Luchador updated";
      this.dirty = false;
      setTimeout(() => (this.successMessage = null), HIDE_SUCCESS_TIMEOUT);

      this.refreshEditor(response.luchador);
      this.cdRef.detectChanges();
    });
  }
}
