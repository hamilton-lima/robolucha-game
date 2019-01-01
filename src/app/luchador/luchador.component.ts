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

  start: MainCode;
  onRepeat: MainCode;
  onGotDamage: MainCode;
  onFound: MainCode;
  onHitOther: MainCode;
  onHitWall: MainCode;

  constructor(private route: ActivatedRoute) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.luchador = data.luchador;

    console.log("luchador found", this.luchador);
    this.start = this.getCode("start");
    this.onRepeat = this.getCode("onRepeat");
    this.onGotDamage = this.getCode("onGotDamage");
    this.onFound = this.getCode("onFound");
    this.onHitOther = this.getCode("onHitOther");
    this.onHitWall = this.getCode("onHitWall");
  }

  getCode(event: string): MainCode {
    let result = this.luchador.codes.find((code: MainCode) => {
      if (code.event == event) {
        return true;
      }
      return false;
    });

    if (!result) {
      result = <MainCode>{};
    }

    return result;
  }
}
