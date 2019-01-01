import { Component, OnInit } from "@angular/core";
import { DefaultService } from "../sdk/api/default.service";
import { MainLuchador } from "../sdk/model/mainLuchador";
import { MainCode } from "../sdk/model/mainCode";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./luchador.component.html",
  styleUrls: ["./luchador.component.css"]
})
export class LuchadorComponent implements OnInit {
  luchador: MainLuchador;
  codes = {
    start: <MainCode>{},
    onRepeat: <MainCode>{},
    onGotDamage: <MainCode>{},
    onFound: <MainCode>{},
    onHitOther: <MainCode>{},
    onHitWall: <MainCode>{}
  };

  constructor(private route: ActivatedRoute) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.luchador = data.luchador;

    console.log("luchador found", this.luchador);
    for( var key in this.codes){
      this.codes[key] = this.getCode(key); 
    }
    // this.codes.start = 
    // this.codes.onRepeat = this.getCode("onRepeat");
    // this.codes.onGotDamage = this.getCode("onGotDamage");
    // this.onFound = this.getCode("onFound");
    // this.onHitOther = this.getCode("onHitOther");
    // this.onHitWall = this.getCode("onHitWall");
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

    let code = this.findCodeByEventName(event);

    if (code) {
      code.script = script;
    } else {
      code = <MainCode>{ event: event, script: script };
      this.luchador.codes.push(code);
    }

    this.codes[event] = code;
  }
}
