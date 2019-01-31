import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MainLuchador, DefaultService, MainCode, MainConfig } from '../sdk';
import { ActivatedRoute } from '@angular/router';

const HIDE_SUCCESS_TIMEOUT = 3000;

@Component({
  selector: 'app-mask-editor',
  templateUrl: './mask-editor.component.html',
  styleUrls: ['./mask-editor.component.css']
})
export class MaskEditorComponent implements OnInit {
  luchador: MainLuchador;
  successMessage: string;

  constructor(
    private route: ActivatedRoute, 
    private api: DefaultService, 
    private cdRef : ChangeDetectorRef) {
    this.luchador = {};
  }

  ngOnInit() {
    const data = this.route.snapshot.data;
    this.refreshEditor(data.luchador);
  }

  refreshEditor(luchador) {
    console.log("refresh luchador", luchador);
    // TODO: Remove this
    luchador.configs.push( <MainConfig>{key: "mask.primary.color", value:"#D79851"});
    luchador.configs.push( <MainConfig>{key: "mask.secondary.color", value:"#D79851"});
    this.luchador = luchador;

  }


  save() {
    const remoteCall = this.api.privateLuchadorPut(this.luchador);

    remoteCall.subscribe(luchador => {
      this.successMessage = "Luchador updated";
      setTimeout(() => this.successMessage = null, HIDE_SUCCESS_TIMEOUT);

      this.refreshEditor(luchador);
      this.cdRef.detectChanges();    
    });
  }
}
