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
    this.refreshEditor(data.luchador);
    this.luchador = data.luchador;
  }

  refreshEditor(luchador) {
    console.log("refresh luchador", luchador);
    this.mediator.luchador.next(luchador);
    this.dirty = false;
  }

  save() {
    let luchador = this.mediator.luchador.value;
    if( luchador ){
      const remoteCall = this.api.privateLuchadorPut(luchador);

      remoteCall.subscribe(luchador => {
        this.successMessage = "Luchador updated";
        setTimeout(() => (this.successMessage = null), HIDE_SUCCESS_TIMEOUT);
  
        this.refreshEditor(luchador);
        this.cdRef.detectChanges();
      });
    }
  }

  onUpdate(luchador: MainLuchador) {
    this.dirty = true;
    console.log("update on luchador", luchador );
    this.mediator.luchador.next(luchador);
  }
}
