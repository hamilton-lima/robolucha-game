import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DefaultService } from "../sdk/api/default.service";
import { MainLuchador } from "../sdk/model/mainLuchador";
import { MainCode } from "../sdk/model/mainCode";
import { ActivatedRoute } from "@angular/router";
import { debounceTime } from "rxjs/operators";

const HIDE_SUCCESS_TIMEOUT = 3000;

@Component({
  selector: "app-home",
  templateUrl: "./luchador.component.html",
  styleUrls: ["./luchador.component.css"]
})
export class LuchadorComponent implements OnInit {
  luchador: MainLuchador;
  dirty: boolean;
  successMessage: string;

  codes = {
    onStart: <MainCode>{},
    onRepeat: <MainCode>{},
    onGotDamage: <MainCode>{},
    onFound: <MainCode>{},
    onHitOther: <MainCode>{},
    onHitWall: <MainCode>{}
  };

  constructor(
    private route: ActivatedRoute, 
    private api: DefaultService, 
    private cdRef : ChangeDetectorRef) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.dirty = false;

    this.refreshEditor(data.luchador);
  }

  canDeactivate(){
    if (this.dirty){
      return window.confirm("You have unsaved changes to your luchador code. Are you sure you want to leave?");
    }
    return true;
  }

  refreshEditor(luchador) {
    console.log("refresh luchador", luchador);
    this.luchador = luchador;
    for (var key in this.codes) {
      this.codes[key] = this.getCode(key);
    }
  }

  getCode(event: string): MainCode {
    let result = this.findCodeByEventName(event);

    if (!result) {
      result = <MainCode>{};
    }

    return result;
  }

  findCodeByEventName(event: string) {
    return this.luchador.codes.find((code: MainCode) => {
      if (code.event == event) {
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

  save() {
    const remoteCall = this.api.privateLuchadorPut(this.luchador);

    remoteCall.subscribe(luchador => {
      this.successMessage = "Luchador updated";
      this.dirty = false;
      setTimeout(() => this.successMessage = null, HIDE_SUCCESS_TIMEOUT);

      this.refreshEditor(luchador);
      this.cdRef.detectChanges();    
    });
  }
}
