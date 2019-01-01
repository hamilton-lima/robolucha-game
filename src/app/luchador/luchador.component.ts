import { Component, OnInit } from "@angular/core";
import { DefaultService } from "../sdk/api/default.service";
import { MainLuchador } from "../sdk/model/mainLuchador";
import { MainCode } from "../sdk/model/mainCode";

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

  constructor(private api: DefaultService) {}

  ngOnInit() {
    this.api.privateLuchadorGet().subscribe((response: MainLuchador) => {
      this.luchador = response;
      this.start = this.getCode(response, "start");
      this.onRepeat = this.getCode(response, "onRepeat");
      this.onGotDamage = this.getCode(response, "onGotDamage");
      this.onFound = this.getCode(response, "onFound");
      this.onHitOther = this.getCode(response, "onHitOther");
      this.onHitWall = this.getCode(response, "onHitWall");
    });
  }

  getCode(luchador: MainLuchador, event:string): MainCode {
    let result = luchador.codes.find( (code: MainCode)=> {
      console.log("code", code );
      if( code.event == event ){
        return true;
      }
      return false;
    });

    if( ! result ){
      result = <MainCode>{};
    }
    
    return result;
  }
}
