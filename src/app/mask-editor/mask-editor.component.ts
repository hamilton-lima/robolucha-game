import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MainLuchador, DefaultService, MainCode, MainConfig } from "../sdk";
import { ActivatedRoute } from "@angular/router";
import { Behavior } from "babylonjs";
import { BehaviorSubject } from "rxjs";
import { MaskEditorMediator } from "./mask-editor.mediator";

const HIDE_SUCCESS_TIMEOUT = 3000;

@Component({
  selector: "app-mask-editor",
  templateUrl: "./mask-editor.component.html",
  styleUrls: ["./mask-editor.component.css"]
})
export class MaskEditorComponent implements OnInit {
  successMessage: string;
  dirty = false;
  luchador: MainLuchador;

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private cdRef: ChangeDetectorRef,
    private mediator: MaskEditorMediator
  ) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    console.log('configs on maskeditor', data.luchador.configs);
    this.refreshEditor(data.luchador.configs);
    this.luchador = data.luchador;
  }

  refreshEditor(configs: MainConfig[]) {
    console.log("refresh luchador", configs);
    this.mediator.configs.next(configs);
    this.dirty = false;
  }

  random(){
    this.api.privateMaskRandomGet().subscribe(configs => {
      this.luchador.configs = configs;
      this.refreshEditor(this.luchador.configs);
      this.dirty = true;
      this.cdRef.detectChanges();
    });
  }

  save() {
    let configs = this.mediator.configs.value;
    if( configs.length > 0 ){
      this.luchador.configs = configs;
      const remoteCall = this.api.privateLuchadorPut(this.luchador);

      remoteCall.subscribe(response => {
        this.successMessage = "Luchador updated";
        setTimeout(() => (this.successMessage = null), HIDE_SUCCESS_TIMEOUT);
  
        this.refreshEditor(response.luchador.configs);
        this.cdRef.detectChanges();
      });
    }
  }

  onUpdate(configs: MainConfig []) {
    this.dirty = true;
    console.log("update on luchador", configs );
    this.mediator.configs.next(configs);
  }
}
